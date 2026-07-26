import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: "newTitle", description: "Новый заголовок" })
  readonly title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "newContent", description: "Новый текст" })
  readonly content?: string;
}
