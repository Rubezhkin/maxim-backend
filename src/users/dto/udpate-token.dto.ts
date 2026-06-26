import { IsString } from "class-validator";

export class UpdateRefreshDto {
  @IsString()
  readonly refreshToken: string;
}
