import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { TokenModule } from "./token/token.module";
import { SubscriptionModule } from "./subscription/subscription.module";
import { PostsModule } from "./posts/posts.module";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { FilesModule } from "./files/files.module";
import { CommentModule } from "./comment/comment.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "static"),
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + "/**/*.model{.ts,.js}"],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TokenModule,
    SubscriptionModule,
    PostsModule,
    FilesModule,
    CommentModule,
  ],
})
export class AppModule {}
