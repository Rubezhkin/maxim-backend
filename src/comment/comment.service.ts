import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./comment.model";
import { Repository } from "typeorm";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { PostsService } from "src/posts/posts.service";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly postService: PostsService,
  ) {}
  async getComment(commentId: number) {
    return this.commentRepository.find({ where: { id: commentId } });
  }
  async createComment(
    id: number,
    postId: number,
    commentDto: CreateCommentDto,
  ) {
    const post = await this.postService.getPostById(postId);
    const comment = this.commentRepository.create({
      ...commentDto,
      authorId: id,
      postId,
      createdAt: new Date(),
    });
    return this.commentRepository.save(comment);
  }

  async deleteComment(id: number, postId: number) {
    const comment = await this.commentRepository.findOneBy({ id: postId });
    if (!comment) {
      throw new BadRequestException("Комментарий не найден!");
    }
    if (comment.authorId !== id) {
      throw new BadRequestException("Вы не автор комментария!");
    }
    await this.commentRepository.remove(comment);
  }
}
