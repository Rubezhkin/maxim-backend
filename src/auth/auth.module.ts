import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { TokenModule } from "src/token/token.module";
import { forwardRef } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  imports: [forwardRef(() => UsersModule), TokenModule],
})
export class AuthModule {}
