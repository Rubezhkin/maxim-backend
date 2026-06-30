import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./users.model";
import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { AuthModule } from "src/auth/auth.module";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    TokenModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
