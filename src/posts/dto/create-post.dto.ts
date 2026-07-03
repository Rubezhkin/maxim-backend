import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  @ApiProperty({ example: "Заголовок поста", description: "Заголовок поста" })
  readonly title: string;
  @IsString()
  @ApiProperty({ example: "Содержимое поста", description: "Содержимое поста" })
  readonly content: string;
}
