import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LikeComment } from "./like-comment.model";
import { Repository } from "typeorm";
import { CommentService } from "src/comment/comment.service";

@Injectable()
export class LikeCommentService {
  constructor(
    @InjectRepository(LikeComment)
    private likeRepository: Repository<LikeComment>,
    private readonly commentService: CommentService,
  ) {}
  async getIsLiked(commentId: number, id: number) {
    const exisitingLike = await this.likeRepository.findOne({
      where: { userId: id, commentId },
    });
    if (!exisitingLike) {
      return false;
    }
    return true;
  }

  async unlikeComment(commentId: number, id: number) {
    const exsistingLike = await this.likeRepository.findOne({
      where: { commentId, userId: id },
    });
    if (!exsistingLike) {
      throw new HttpException("Лайк не найден", HttpStatus.BAD_REQUEST);
    }
    await this.likeRepository.delete({ commentId, userId: id });
  }
  async likeComment(commentId: number, id: number) {
    const exsistingLike = await this.likeRepository.findOne({
      where: { commentId, userId: id },
    });
    if (exsistingLike) {
      throw new HttpException("Лайк уже стоит", HttpStatus.BAD_REQUEST);
    }
    const comment = await this.commentService.getComment(commentId);
    if (!comment) {
      throw new HttpException("Комментарий не найден", HttpStatus.BAD_REQUEST);
    }
    const like = this.likeRepository.create({ commentId, userId: id });
    await this.likeRepository.save(like);
  }

  async getLikesCount(commentId: number) {
    const count = await this.likeRepository.count({ where: { commentId } });
    return count;
  }
}
