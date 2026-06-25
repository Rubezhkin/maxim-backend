import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./update-user.dto";
import { CreateUserDto } from "./create-user.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";

@ApiTags("Пользователи")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Создать нового пользователя" })
  @ApiResponse({
    status: 201,
    description: "Пользователь успешно создан",
    type: User,
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: "Получить всех пользователей" })
  @ApiResponse({
    status: 200,
    description: "Список пользователей успешно получен",
    type: [User],
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: "Получить пользователя по логину" })
  @ApiResponse({
    status: 200,
    description: "Пользователь успешно получен",
    type: User,
  })
  @Get(":login")
  findOne(@Param("login") login: string) {
    return this.usersService.findOne(login);
  }

  @ApiOperation({ summary: "Обновить информацию о пользователе" })
  @ApiResponse({
    status: 200,
    description: "Информация о пользователе успешно обновлена",
    type: User,
  })
  @Put(":login")
  update(@Param("login") login: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(login, updateUserDto);
  }

  @ApiOperation({ summary: "Удалить пользователя" })
  @ApiResponse({
    status: 200,
    description: "Пользователь успешно удален",
  })
  @Delete(":login")
  remove(@Param("login") login: string) {
    return this.usersService.remove(login);
  }
}
