import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsString } from "class-validator";

export class TokensDto {
  constructor(access: string, refresh: string) {
    this.access = access;
    this.refresh = refresh;
  }
  @ApiProperty({ description: "Access токен" })
  @IsString()
  readonly access: string;
  @ApiProperty({ description: "Refresh токен" })
  @IsString()
  readonly refresh: string;
}
