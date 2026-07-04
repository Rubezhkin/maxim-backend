import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @ApiProperty({ example: "Комментарий", description: "Комментарий" })
  readonly comment: string;
}
