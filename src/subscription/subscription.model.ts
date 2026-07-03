import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/users.model";
import { Column, Entity, ForeignKey, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор автора",
  })
  @ForeignKey(() => User, { onDelete: "CASCADE" })
  @Column()
  author: number;
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор подписчика",
  })
  @ForeignKey(() => User, { onDelete: "CASCADE" })
  @Column()
  subscriber: number;
}
