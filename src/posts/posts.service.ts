import { BadRequestException, Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "./posts.model";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { SubscriptionService } from "src/subscription/subscription.service";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async createPost(authorId: number, postDto: CreatePostDto) {
    const post = this.postRepository.create({
      ...postDto,
      authorId,
      createdAt: new Date(),
    });
    return this.postRepository.save(post);
  }

  async getPostsByAuthor(authorId: number) {
    return this.postRepository.find({
      where: { authorId },
      order: { createdAt: "DESC" },
    });
  }

  async getPostsBySubscriptions(subscriberId: number) {
    const subscriptions =
      await this.subscriptionService.getSubscriptions(subscriberId);
    const authorIds = subscriptions.map((sub) => sub.id);
    return this.postRepository.find({
      where: { authorId: In(authorIds) },
      order: { createdAt: "DESC" },
    });
  }

  async getPostById(postId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new BadRequestException("Post not found");
    }
    return post;
  }

  async deletePost(postId: number, authorId: number) {
    const post = await this.getPostById(postId);
    if (post.authorId !== authorId) {
      throw new BadRequestException("You are not the author of this post");
    }
    return this.postRepository.remove(post);
  }

  async updatePost(postId: number, authorId: number, postDto: UpdatePostDto) {
    const post = await this.getPostById(postId);
    if (post.authorId !== authorId) {
      throw new BadRequestException("You are not the author of this post");
    }
    Object.assign(post, postDto);
    return this.postRepository.save(post);
  }
}
