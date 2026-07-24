import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { UsersService } from "src/users/users.service";
import { TokenService } from "src/token/token.service";
import { User } from "src/users/users.model";
import { AuthUserDto } from "./dto/auth-user.dto";
import { TokensDto } from "./dto/tokens.dto";
import { UpdatePasswordDto } from "src/users/dto/update-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}
  async login(userDTO: CreateUserDto) {
    const user = await this.validateUser(userDTO);
    const tokens = await this.saveToken(user);
    return this.sendAnswer(user, tokens);
  }

  async registration(userDTO: CreateUserDto) {
    const candidate = await this.userService.findOneByLogin(userDTO.login);
    if (candidate) {
      throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(userDTO.password, 10);
    const user = await this.userService.create({
      ...userDTO,
      password: hashedPassword,
    });
    const tokens = await this.saveToken(user);
    return this.sendAnswer(user, tokens);
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException("Токен недействителен", HttpStatus.BAD_REQUEST);
    }
    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await this.tokenService.getToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw new HttpException("Токен недействителен", HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne(userData.id);
    if (user) {
      const tokens = await this.saveToken(user);
      return tokens;
    }
  }

  private async validateUser(userDTO: CreateUserDto) {
    const user = await this.userService.findOneByLogin(userDTO.login);
    if (!user) {
      throw new UnauthorizedException({
        message: "Логин или пароль неправильный",
      });
    }
    const passwordEquals = await bcrypt.compare(
      userDTO.password,
      user.password,
    );
    if (passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: "Логин или пароль неправильный",
    });
  }

  async logout(refreshToken: string) {
    return await this.tokenService.removeToken(refreshToken);
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    const userDto = new CreateUserDto(
      user.login,
      updatePasswordDto.oldPassword,
    );
    const validatedUser = await this.validateUser(userDto);
    if (!validatedUser) {
      throw new UnauthorizedException({
        message: "Старый пароль неправильный",
      });
    }
    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    await this.userService.updatePassword(id, hashedPassword);
  }

  private async saveToken(user: User) {
    const tokens = this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user.id, tokens.refresh);
    return tokens;
  }

  private sendAnswer(user: User, tokens: TokensDto) {
    const result = new AuthUserDto(
      user.id,
      user.login,
      tokens.access,
      tokens.refresh,
    );
    return result;
  }
}
