import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LikePost } from "./like-post.model";
import { Repository } from "typeorm";
import { PostsService } from "src/posts/posts.service";

@Injectable()
export class LikePostService {
  constructor(
    @InjectRepository(LikePost)
    private likeRepository: Repository<LikePost>,
    private readonly postService: PostsService,
  ) {}
  async getIsLiked(postId: number, id: number) {
    const exisitingLike = await this.likeRepository.findOne({
      where: { userId: id, postId },
    });
    if (!exisitingLike) {
      return false;
    }
    return true;
  }
  async unlikePost(postId: number, id: number) {
    const exsistingLike = await this.likeRepository.findOne({
      where: { postId, userId: id },
    });
    if (!exsistingLike) {
      throw new HttpException("Лайк не найден", HttpStatus.BAD_REQUEST);
    }
    await this.likeRepository.delete({ postId, userId: id });
  }
  async likePost(postId: number, id: number) {
    const exsistingLike = await this.likeRepository.findOne({
      where: { postId, userId: id },
    });
    if (exsistingLike) {
      throw new HttpException("Лайк уже стоит", HttpStatus.BAD_REQUEST);
    }
    const post = await this.postService.getPostById(postId);
    if (!post) {
      throw new HttpException("Пост не найден", HttpStatus.BAD_REQUEST);
    }
    const like = this.likeRepository.create({ postId, userId: id });
    await this.likeRepository.save(like);
  }
  async getLikesCount(postId: number) {
    const count = await this.likeRepository.count({ where: { postId } });
    return count;
  }
}
