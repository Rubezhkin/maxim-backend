import { ApiProperty } from "@nestjs/swagger";
import { Comment } from "src/comment/comment.model";
import { User } from "src/users/users.model";
import { Column, Entity, ForeignKey, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LikeComment {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор лайка",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор комментария",
  })
  @ForeignKey(() => Comment, { onDelete: "CASCADE" })
  @Column()
  commentId: number;

  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор пользователя",
  })
  @ForeignKey(() => User, { onDelete: "CASCADE" })
  @Column()
  userId: number;
}
