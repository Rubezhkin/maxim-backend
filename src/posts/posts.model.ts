import { ApiProperty } from "@nestjs/swagger";
import { CommentController } from "src/comment/comment.controller";
import { Comment } from "src/comment/comment.model";
import { MediaFile } from "src/files/files.model";
import { User } from "src/users/users.model";
import {
  Column,
  Entity,
  ForeignKey,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Post {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор поста",
  })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({
    example: "Заголовок поста",
    description: "Заголовок поста",
  })
  @Column()
  title: string;

  @ApiProperty({
    example: "Содержимое поста",
    description: "Содержимое поста",
  })
  @Column()
  content: string;

  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор пользователя, создавшего пост",
  })
  @ForeignKey(() => User, { onDelete: "CASCADE" })
  @Column()
  authorId: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @OneToMany(() => MediaFile, (mediaFile) => mediaFile.post, {
    cascade: true,
  })
  mediaFiles: MediaFile[];

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: CommentController[];
}
