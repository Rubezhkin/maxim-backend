import { Controller, Post, Req, Res, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { User } from "src/users/users.model";
import type { Response, Request } from "express";

@ApiTags("Авторизация")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Авторизоваться" })
  @ApiResponse({
    status: 201,
    description: "Пользователь успешно авторизован",
    type: User,
  })
  @Post("/login")
  async login(
    @Body() userDTO: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    const data = await this.authService.login(userDTO);
    res.cookie("refreshToken", data.tokens.refresh, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return data;
  }

  @ApiOperation({ summary: "Создать нового пользователя" })
  @ApiResponse({
    status: 201,
    description: "Пользователь успешно создан",
    type: User,
  })
  @Post("/registration")
  async registration(
    @Body() userDTO: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    const data = await this.authService.registration(userDTO);
    res.cookie("refreshToken", data.tokens.refresh, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return data;
  }

  @ApiOperation({ summary: "Выход пользователя" })
  @Post("/logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return { message: "No refresh token" };
    }
    await this.authService.logout(refreshToken);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return { message: "logout succesful!" };
  }

  @ApiOperation({ summary: "Обновить токен" })
  @Post("/refresh")
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    const token = await this.authService.refreshToken(refreshToken);
    if (token) {
      res.cookie("refreshToken", token.refresh, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      return token;
    }
  }
}
