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
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { SubscriptionService } from "./subscription.service";

@ApiTags("Подписки")
@Controller("subscription")
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}
  @ApiOperation({ summary: "Получить количество подписок" })
  @ApiResponse({
    status: 200,
    description: "Получено количество подписок",
  })
  @UseGuards(JwtAuthGuard)
  @Get("subscription-count")
  async getSubscriptionCount(@Query("userId") userId: number) {
    const count = await this.subscriptionService.getSubscriptionCount(userId);
    return { count };
  }

  @ApiOperation({ summary: "Получить количество подписчиков" })
  @ApiResponse({
    status: 200,
    description: "Получено количество подписчиков",
  })
  @UseGuards(JwtAuthGuard)
  @Get("subscriber-count")
  async getSubscriberCount(@Query("authorId") authorId: number) {
    const count = await this.subscriptionService.getSubscriberCount(authorId);
    return { count };
  }

  @ApiOperation({ summary: "Подписаться на пользователя" })
  @ApiResponse({
    status: 200,
    description: "Подписка успешно оформлена",
  })
  @UseGuards(JwtAuthGuard)
  @Post("subscribe")
  async subscribeToUser(
    @Query("authorId") authorId: number,
    @Req() req: Request,
  ) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    await this.subscriptionService.subscribeToUser(authorId, id);
    return { message: "Подписка успешно оформлена" };
  }

  @ApiOperation({ summary: "Отписаться от пользователя" })
  @ApiResponse({
    status: 200,
    description: "Отписка успешно оформлена",
  })
  @UseGuards(JwtAuthGuard)
  @Post("unsubscribe")
  async unsubscribeFromUser(
    @Query("authorId") authorId: number,
    @Req() req: Request,
  ) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    await this.subscriptionService.unsubscribeFromUser(authorId, id);
    return { message: "Отписка успешно оформлена" };
  }

  @ApiOperation({ summary: "Список подписок" })
  @ApiResponse({
    status: 200,
    description: "Получен список подписок",
  })
  @UseGuards(JwtAuthGuard)
  @Get("subscriptions")
  async getSubscriptionList(@Query("subscriberId") subscriberId: number) {
    const subscriptions =
      await this.subscriptionService.getSubscriptions(subscriberId);
    return { subscriptions };
  }

  @ApiOperation({ summary: "Список подписчиков" })
  @ApiResponse({
    status: 200,
    description: "Получен список подписчиков",
  })
  @UseGuards(JwtAuthGuard)
  @Get("subscribers")
  async getSubscriberList(@Query("authorId") authorId: number) {
    const subscribers = await this.subscriptionService.getSubscribers(authorId);
    return { subscribers };
  }

  @ApiOperation({ summary: "Проверка на наличие подписки" })
  @ApiResponse({
    status: 200,
    description: "Выявлена наличие подписки",
  })
  @UseGuards(JwtAuthGuard)
  @Get("isSubscribed")
  async getIsSubscribed(
    @Query("authorId") authorId: number,
    @Req() req: Request,
  ) {
    const id = (req as Request & { user?: { id?: number } }).user?.id;
    if (!id) throw new BadRequestException("User not found on request");
    const isSubscribed = await this.subscriptionService.getIsSubscribed(
      authorId,
      id,
    );
    return { isSubscribed };
  }
}
