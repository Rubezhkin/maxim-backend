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

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":login")
  findOne(@Param("login") login: string) {
    return this.usersService.findOne(login);
  }

  @Put(":login")
  update(@Param("login") login: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(login, updateUserDto);
  }

  @Delete(":login")
  remove(@Param("login") login: string) {
    return this.usersService.remove(login);
  }
}
