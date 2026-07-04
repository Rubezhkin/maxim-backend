import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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

  @ApiOperation({ summary: "Создать новый пост" })
  @ApiResponse({
    status: 201,
    description: "Пост успешно создан",
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(
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
  deletePost(@Query("id") postId: number, @Req() req: Request) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    return this.commentService.deleteComment(id, postId);
  }
}
