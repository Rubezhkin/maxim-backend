/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { User } from "src/users/users.model";
import type { Response, Request } from "express";
import { UpdatePasswordDto } from "src/users/dto/update-password.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";

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
    res.cookie("refreshToken", data.refresh, {
      httpOnly: process.env.HTTP_ONLY === "true",
      secure: process.env.SECURE === "true",
      sameSite: (process.env.SAME_SITE as "lax" | "strict" | "none") || "lax",
    });

    return { id: data.id, login: data.login, access: data.access };
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
    res.cookie("refreshToken", data.refresh, {
      httpOnly: process.env.HTTP_ONLY === "true",
      secure: process.env.SECURE === "true",
      sameSite: (process.env.SAME_SITE as "lax" | "strict" | "none") || "lax",
    });

    return { id: data.id, login: data.login, access: data.access };
  }

  @ApiOperation({ summary: "Выход пользователя" })
  @Post("/logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return { message: "Нет refresh токена" };
    }
    await this.authService.logout(refreshToken);
    res.clearCookie("refreshToken", {
      httpOnly: process.env.HTTP_ONLY === "true",
      secure: process.env.SECURE === "true",
      sameSite: (process.env.SAME_SITE as "lax" | "strict" | "none") || "lax",
    });
    return { message: "Выход прошел успешно!" };
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
      await this.authService.logout(refreshToken);
      res.cookie("refreshToken", token.refresh, {
        httpOnly: process.env.HTTP_ONLY === "true",
        secure: process.env.SECURE === "true",
        sameSite: (process.env.SAME_SITE as "lax" | "strict" | "none") || "lax",
      });
      return { access: token.access };
    }
  }

  @ApiOperation({ summary: "Обновить пароль" })
  @UseGuards(JwtAuthGuard)
  @Post("/update-password")
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req: Request,
  ) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    await this.authService.updatePassword(id, updatePasswordDto);
    return { message: "Пароль успешно обновлен" };
  }
}
