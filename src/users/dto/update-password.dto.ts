import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty({ example: "newPassword123", description: "Новый пароль" })
  readonly newPassword: string;
}
