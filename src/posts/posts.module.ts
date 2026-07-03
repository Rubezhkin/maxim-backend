import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { Post } from "./posts.model";
import { TokenModule } from "src/token/token.module";
import { UsersModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionModule } from "src/subscription/subscription.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UsersModule,
    TokenModule,
    SubscriptionModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
