import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "./subscription.model";
import { Repository } from "typeorm";
import { User } from "src/users/users.model";
import { UsersService } from "src/users/users.service";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private userService: UsersService,
  ) {}

  async getSubscriptionCount(userId: number): Promise<number> {
    const count = await this.subscriptionRepository.count({
      where: { subscriber: userId },
    });
    return count;
  }

  async getSubscriberCount(authorId: number): Promise<number> {
    const count = await this.subscriptionRepository.count({
      where: { author: authorId },
    });
    return count;
  }

  async subscribeToUser(authorId: number, subscriberId: number): Promise<void> {
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: { author: authorId, subscriber: subscriberId },
    });
    if (existingSubscription) {
      throw new HttpException(
        "Подписка уже существует",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (authorId == subscriberId) {
      throw new HttpException(
        "Нельзя подписаться на самого себя",
        HttpStatus.BAD_REQUEST,
      );
    }
    const author = await this.userService.findOneById(authorId);
    if (!author) {
      throw new HttpException("Автор не найден", HttpStatus.NOT_FOUND);
    }
    const subscription = this.subscriptionRepository.create({
      author: authorId,
      subscriber: subscriberId,
    });
    await this.subscriptionRepository.save(subscription);
  }

  async unsubscribeFromUser(
    authorId: number,
    subscriberId: number,
  ): Promise<void> {
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: { author: authorId, subscriber: subscriberId },
    });
    if (!existingSubscription) {
      throw new HttpException("Подписка не найдена", HttpStatus.NOT_FOUND);
    }
    await this.subscriptionRepository.delete({
      author: authorId,
      subscriber: subscriberId,
    });
  }

  async getSubscriptions(subscriberId: number): Promise<User[]> {
    const subscriptions = await this.subscriptionRepository.find({
      where: { subscriber: subscriberId },
    });
    const authors = (
      await Promise.all(
        subscriptions.map((subscription) =>
          this.userService.findOneById(subscription.author),
        ),
      )
    ).filter((author): author is User => author !== null);
    return authors;
  }

  async getSubscribers(authorId: number): Promise<User[]> {
    const subscriptions = await this.subscriptionRepository.find({
      where: { author: authorId },
    });
    const subscribers = (
      await Promise.all(
        subscriptions.map((subscription) =>
          this.userService.findOneRequest(subscription.subscriber),
        ),
      )
    ).filter((subscriber): subscriber is User => subscriber !== null);
    return subscribers;
  }
}
