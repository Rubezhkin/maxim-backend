import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { LikeCommentService } from "./like-comment.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@ApiTags("Лайки комментарий")
@Controller("like-comment")
export class LikeCommentController {
  constructor(private likeService: LikeCommentService) {}

  @ApiOperation({ summary: "Получить количество лайков" })
  @ApiResponse({
    status: 200,
    description: "Получено количество лайков",
  })
  @UseGuards(JwtAuthGuard)
  @Get("likes-count")
  async getLikesCount(@Query("commentId") commentId: number) {
    const count = await this.likeService.getLikesCount(commentId);
    return { count };
  }

  @ApiOperation({ summary: "Поставить лайк комментарию" })
  @ApiResponse({
    status: 200,
    description: "Лайк успешно поставлен",
  })
  @UseGuards(JwtAuthGuard)
  @Post("like")
  async likeComment(
    @Query("commentId") commentId: number,
    @Req() req: Request,
  ) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    await this.likeService.likeComment(commentId, id);
    return { message: "Лайк успешно поставлен" };
  }

  @ApiOperation({ summary: "Убрать лайк комментарию" })
  @ApiResponse({
    status: 200,
    description: "Лайк успешно убран",
  })
  @UseGuards(JwtAuthGuard)
  @Post("unlike")
  async unlikeComment(
    @Query("commentId") commentId: number,
    @Req() req: Request,
  ) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    await this.likeService.unlikeComment(commentId, id);
    return { message: "Лайк успешно убран" };
  }

  @ApiOperation({ summary: "Проверка на наличие лайка" })
  @ApiResponse({
    status: 200,
    description: "Выявлена наличие лайка",
  })
  @UseGuards(JwtAuthGuard)
  @Get("isLiked")
  async getIsSubscribed(
    @Query("commentId") commentId: number,
    @Req() req: Request,
  ) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    const isLiked = await this.likeService.getIsLiked(commentId, id);
    return { isLiked };
  }
}
