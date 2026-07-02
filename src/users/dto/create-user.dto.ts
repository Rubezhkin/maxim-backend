import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserDto {
  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
  }
  @IsString()
  @ApiProperty({ example: "Ivanov", description: "Логин" })
  readonly login: string;
  @ApiProperty({ example: "pass1234", description: "Пароль" })
  @IsString()
  readonly password: string;
}
