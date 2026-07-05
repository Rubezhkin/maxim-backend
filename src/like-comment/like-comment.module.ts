import { Module } from "@nestjs/common";
import { LikeCommentService } from "./like-comment.service";
import { LikeCommentController } from "./like-comment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LikeComment } from "./like-comment.model";
import { CommentModule } from "src/comment/comment.module";
import { TokenModule } from "src/token/token.module";

@Module({
  providers: [LikeCommentService],
  controllers: [LikeCommentController],
  imports: [
    TypeOrmModule.forFeature([LikeComment]),
    CommentModule,
    TokenModule,
  ],
})
export class LikeCommentModule {}
