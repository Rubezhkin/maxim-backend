import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
  BadRequestException,
  Query,
} from "@nestjs/common";
import type { Request } from "express";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@ApiTags("Пользователи")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Получить своего пользователя" })
  @ApiResponse({
    status: 200,
    description: "Пользователь успешно получен",
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @Get("me")
  findMe(@Req() req: Request) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    return this.usersService.findOneRequest(id);
  }

  @ApiOperation({ summary: "Получить пользователя по логину" })
  @ApiResponse({
    status: 200,
    description: "Пользователь успешно получен",
    type: User,
  })
  @UseGuards(JwtAuthGuard)

  @Get("id")
  findOne(@Query("id") id: number) {
    return this.usersService.findOneRequest(id);
  }

  @ApiOperation({ summary: "Получить всех пользователей" })
  @ApiResponse({
    status: 200,
    description: "Список пользователей успешно получен",
    type: [User],
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();

  }

  @ApiOperation({ summary: "Обновить информацию о пользователе" })
  @ApiResponse({
    status: 200,
    description: "Информация о пользователе успешно обновлена",
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: "Удалить пользователя" })
  @ApiResponse({
    status: 200,
    description: "Пользователь успешно удален",
  })
  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@Req() req: Request) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    return this.usersService.remove(id);
  }
}
