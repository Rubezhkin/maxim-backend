import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt/dist/jwt.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/users.model";
import { UpdateRefreshDto } from "src/users/dto/udpate-token.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(userDTO: CreateUserDto) {
    const user = await this.validateUser(userDTO);
    const tokens = await this.generateToken(user);

    const hashedRefresh = await bcrypt.hash(tokens.refresh, 5);
    await this.userService.updateToken(user.login, {
      refreshToken: hashedRefresh,
    });

    return tokens;
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
    const tokens = await this.generateToken(user);
    const hashedRefresh = await bcrypt.hash(tokens.refresh, 5);
    await this.userService.updateToken(user.login, {
      refreshToken: hashedRefresh,
    });
    return tokens;
  }

  async refreshToken(refreshToken: UpdateRefreshDto) {
    if (!refreshToken) {
      throw new UnauthorizedException({
        message: "Invalid refresh token",
      });
    }

    const payload = this.jwtService.verify<{ id: number; login: string }>(
      refreshToken.refreshToken,
      { secret: process.env.JWT_SECRET_REFRESH },
    );

    const user = await this.userService.findOne(payload.login);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException({
        message: "Invalid refresh token",
      });
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken.refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException({
        message: "Invalid refresh token",
      });
    }

    const tokens = await this.generateToken(user);
    const hashedRefresh = await bcrypt.hash(tokens.refresh, 5);
    await this.userService.updateToken(user.login, {
      refreshToken: hashedRefresh,
    });

    return tokens;
  }

  private async generateToken(user: User) {
    const payload = { id: user.id, login: user.login };
    const access = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_ACCESS,
      expiresIn: "15m",
    });
    const refresh = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH,
      expiresIn: "30d",
    });
    return {
      access,
      refresh,
    };
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
}
