import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LikePostService } from "./like-post.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@ApiTags("Лайки постов")
@Controller("like-post")
export class LikePostController {
  constructor(private likeService: LikePostService) {}

  @ApiOperation({ summary: "Получить количество лайков" })
  @ApiResponse({
    status: 200,
    description: "Получено количество лайков",
  })
  @UseGuards(JwtAuthGuard)
  @Get("likes-count")
  async getLikesCount(@Query("postId") postId: number) {
    const count = await this.likeService.getLikesCount(postId);
    return { count };
  }

  @ApiOperation({ summary: "Поставить лайк посту" })
  @ApiResponse({
    status: 200,
    description: "Лайк успешно поставлен",
  })
  @UseGuards(JwtAuthGuard)
  @Post("like")
  async likeComment(@Query("postId") postId: number, @Req() req: Request) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    await this.likeService.likePost(postId, id);
    return { message: "Лайк успешно поставлен" };
  }

  @ApiOperation({ summary: "Убрать лайк посту" })
  @ApiResponse({
    status: 200,
    description: "Лайк успешно убран",
  })
  @UseGuards(JwtAuthGuard)
  @Post("unlike")
  async unlikeComment(@Query("postId") postId: number, @Req() req: Request) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    await this.likeService.unlikePost(postId, id);
    return { message: "Лайк успешно убран" };
  }

  @ApiOperation({ summary: "Проверка на наличие лайка" })
  @ApiResponse({
    status: 200,
    description: "Выявлена наличие лайка",
  })
  @UseGuards(JwtAuthGuard)
  @Get("isLiked")
  async getIsSubscribed(@Query("postId") postId: number, @Req() req: Request) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    const isLiked = await this.likeService.getIsLiked(postId, id);
    return { isLiked };
  }
}
