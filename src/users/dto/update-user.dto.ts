import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: "newLogin", description: "Новый логин" })
  readonly login?: string;
}
