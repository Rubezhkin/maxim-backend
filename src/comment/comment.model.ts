import { ApiProperty } from "@nestjs/swagger";
import { Post } from "src/posts/posts.model";
import { User } from "src/users/users.model";
import {
  Column,
  Entity,
  ForeignKey,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Comment {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор комментария",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "Комментарий",
    description: "Комментарий",
  })
  @Column()
  comment: string;

  @ApiProperty({
    example: 1,
    description:
      "Уникальный идентификатор поста, к которому относится комментарий",
  })
  @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
  post: Post;

  @ApiProperty({
    example: 1,
    description: "Автор комментария",
  })
  @ForeignKey(() => User, { onDelete: "CASCADE" })
  @Column()
  authorId: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
