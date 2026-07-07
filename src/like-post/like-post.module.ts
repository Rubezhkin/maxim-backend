import { Module } from "@nestjs/common";
import { LikePostController } from "./like-post.controller";
import { LikePostService } from "./like-post.service";
import { LikePost } from "./like-post.model";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenModule } from "src/token/token.module";
import { PostsModule } from "src/posts/posts.module";

@Module({
  controllers: [LikePostController],
  providers: [LikePostService],
  imports: [TypeOrmModule.forFeature([LikePost]), PostsModule, TokenModule],
})
export class LikePostModule {}
