import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Token } from "./token.model";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([Token]), JwtModule.register({})],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
