import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UpdatePostDto } from "./dto/update-post.dto";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: "Создать новый пост" })
  @ApiResponse({
    status: 201,
    description: "Пост успешно создан",
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("image"))
  createPost(
    @Req() req: Request,
    @Body() postDto: CreatePostDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    return this.postsService.createPost(id, postDto, image);
  }

  @ApiOperation({ summary: "Обновить пост" })
  @ApiResponse({
    status: 200,
    description: "Пост успешно обновлен",
  })
  @Put()
  @UseGuards(JwtAuthGuard)
  updatePost(
    @Query("id") postId: number,
    @Req() req: Request,
    @Body() postDto: UpdatePostDto,
  ) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    return this.postsService.updatePost(postId, id, postDto);
  }

  @ApiOperation({ summary: "Удалить пост" })
  @ApiResponse({
    status: 200,
    description: "Пост успешно удален",
  })
  @Delete()
  @UseGuards(JwtAuthGuard)
  deletePost(@Query("id") postId: number, @Req() req: Request) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    return this.postsService.deletePost(postId, id);
  }

  @ApiOperation({ summary: "Получить пост по ID" })
  @ApiResponse({
    status: 200,
    description: "Пост успешно получен",
  })
  @Get("/by-id")
  @UseGuards(JwtAuthGuard)
  getPostById(@Query("id") postId: number) {
    return this.postsService.getPostById(postId);
  }

  @ApiOperation({ summary: "Получить посты автора" })
  @ApiResponse({
    status: 200,
    description: "Посты автора успешно получены",
  })
  @Get("/by-author")
  @UseGuards(JwtAuthGuard)
  getPostsByAuthor(@Query("authorId") authorId: number) {
    return this.postsService.getPostsByAuthor(authorId);
  }

  @ApiOperation({ summary: "Получить посты по подпискам" })
  @ApiResponse({
    status: 200,
    description: "Посты по подпискам успешно получены",
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  getPostsBySubscriptions(@Req() req: Request) {
    const subscriberId = (req as Request & { user?: { id?: number } }).user?.id;
    if (!subscriberId)
      throw new BadRequestException("User not found on request");
    return this.postsService.getPostsBySubscriptions(subscriberId);
  }
}
