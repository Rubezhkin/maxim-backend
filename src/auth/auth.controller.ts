import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Body } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { User } from "src/users/users.model";
import { UpdateRefreshDto } from "src/users/dto/udpate-token.dto";

@ApiTags("Авторизация")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  login(@Body() userDTO: CreateUserDto) {
    return this.authService.login(userDTO);
  }

  @ApiOperation({ summary: "Создать нового пользователя" })
  @ApiResponse({
    status: 201,
    description: "Пользователь успешно создан",
    type: User,
  })
  @Post("/registration")
  registration(@Body() userDTO: CreateUserDto) {
    return this.authService.registration(userDTO);
  }

  @Post("/refresh")
  refresh(@Body() refreshTokenDTO: UpdateRefreshDto) {
    return this.authService.refreshToken(refreshTokenDTO);
  }
}
