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

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}
  async login(userDTO: CreateUserDto) {
    const user = await this.validateUser(userDTO);
    const tokens = this.tokenService.generateTokens(user);
    this.tokenService.saveToken(user.id, tokens.refresh);
    return { tokens, user };
  }

  async registration(userDTO: CreateUserDto) {
    const candidate = await this.userService.findOne(userDTO.login);
    if (candidate) {
      throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(userDTO.password, 5);
    const user = await this.userService.create({
      ...userDTO,
      password: hashedPassword,
    });
    const tokens = this.tokenService.generateTokens(user);
    this.tokenService.saveToken(user.id, tokens.refresh);
    return { tokens, user };
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
    const user = await this.userService.findOneById(userData.id);
    if (user) {
      const tokens = this.tokenService.generateTokens(user);
      this.tokenService.saveToken(user.id, tokens.refresh);
      return tokens;
    }
  }

  private async validateUser(userDTO: CreateUserDto) {
    const user = await this.userService.findOne(userDTO.login);
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

  async logout(refreshToken) {
    return this.tokenService.removeToken(refreshToken);
  }
}
