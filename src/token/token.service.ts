import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/users.model";
import { Token } from "./token.model";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  generateTokens(user: User) {
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

  async saveToken(userId: number, refresh: string) {
    const token = await this.tokenRepository.save({
      user: userId,
      refresh: refresh,
    });
    return token;
  }

  async removeToken(refreshToken: string) {
    return await this.tokenRepository.delete({ refresh: refreshToken });
  }

  validateAccessToken(token: string) {
    try {
      const userData = this.jwtService.verify<{
        id: number;
        login: string;
      }>(token, { secret: process.env.JWT_SECRET_ACCESS });
      return userData;
    } catch {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = this.jwtService.verify<{ id: number; login: string }>(
        token,
        { secret: process.env.JWT_SECRET_REFRESH },
      );
      return userData;
    } catch {
      return null;
    }
  }

  getToken(refreshToken: string) {
    return this.tokenRepository.findOneBy({ refresh: refreshToken });
  }
}
