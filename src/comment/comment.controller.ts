import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: "Создать новый комментарий" })
  @ApiResponse({
    status: 201,
    description: "комментарий успешно создан",
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  createComment(
    @Req() req: Request,
    @Body() commentDto: CreateCommentDto,
    @Query("id") postId: number,
  ) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    return this.commentService.createComment(id, postId, commentDto);
  }

  @ApiOperation({ summary: "Удалить комментарий" })
  @ApiResponse({
    status: 200,
    description: "Комментарий успешно удален",
  })
  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteComment(@Query("id") commentId: number, @Req() req: Request) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    return this.commentService.deleteComment(id, commentId);
  }

  @ApiOperation({ summary: "Получить комментарии от поста" })
  @ApiResponse({
    status: 200,
    description: "Получены комментарии",
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  getComments(@Query("id") postId: number) {
    return this.commentService.getComments(postId);
  }

  @ApiOperation({ summary: "Получить количество комментариев к посту" })
  @ApiResponse({
    status: 200,
    description: "Получено количество комментариев",
  })
  @Get("comments-count")
  @UseGuards(JwtAuthGuard)
  async getCommentsCount(@Query("id") postId: number) {
    const count = await this.commentService.getCommentsCount(postId);
    return { count };
  }
}
