import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class GetUserDto {
  constructor(id: number, login: string) {
    this.id = id;
    this.login = login;
  }
  @IsNumber()
  @ApiProperty({ example: "1", description: "Номер пользователя" })
  readonly id: number;
  @IsString()
  @ApiProperty({ example: "Ivanov", description: "Логин" })
  readonly login: string;
}
