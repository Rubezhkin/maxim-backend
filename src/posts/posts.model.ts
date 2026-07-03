import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/users.model";
import { Column, Entity, ForeignKey, PrimaryGeneratedColumn } from "typeorm";

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
}
