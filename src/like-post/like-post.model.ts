import { ApiProperty } from "@nestjs/swagger";
import { Post } from "src/posts/posts.model";
import { User } from "src/users/users.model";
import { Column, Entity, ForeignKey, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LikePost {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор лайка",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор поста",
  })
  @ForeignKey(() => Post, { onDelete: "CASCADE" })
  @Column()
  postId: number;

  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор пользователя",
  })
  @ForeignKey(() => User, { onDelete: "CASCADE" })
  @Column()
  userId: number;
}
