import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "./comment.model";
import { PostsModule } from "src/posts/posts.module";
import { TokenModule } from "src/token/token.module";

@Module({
  providers: [CommentService],
  controllers: [CommentController],
  imports: [TypeOrmModule.forFeature([Comment]), PostsModule, TokenModule],
  exports: [CommentService],
})
export class CommentModule {}
