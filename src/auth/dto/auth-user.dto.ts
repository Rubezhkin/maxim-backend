import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthUserDto {
  constructor(id: number, login: string, access: string, refresh: string) {
    this.id = id;
    this.login = login;
    this.access = access;
    this.refresh = refresh;
  }

  @IsNumber()
  @ApiProperty({ example: "1", description: "Номер пользователя" })
  readonly id: number;
  @IsString()
  @ApiProperty({ example: "Ivanov", description: "Логин" })
  readonly login: string;
  @ApiProperty({ description: "Access токен" })
  @IsString()
  readonly access: string;
  @ApiProperty({ description: "Refresh токен" })
  @IsString()
  readonly refresh: string;
}
