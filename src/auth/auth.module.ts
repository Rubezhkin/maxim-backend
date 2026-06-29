import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { TokenModule } from "src/token/token.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, TokenModule],
})
export class AuthModule {}
