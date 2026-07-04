import { ApiProperty } from "@nestjs/swagger";
import { Post } from "src/posts/posts.model";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MediaFile {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор файла",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "Название файла",
    description: "Название файла",
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор поста, к которому относится файл",
  })
  @ManyToOne(() => Post, (post) => post.mediaFiles, { onDelete: "CASCADE" })
  post: Post;
}
