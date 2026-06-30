import { User } from "src/users/users.model";
import { Column, Entity, ForeignKey } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор пользователя",
  })
  @ForeignKey(() => User, { onDelete: "CASCADE" })
  @Column()
  user: number;
  @ApiProperty({
    description: "Хэш refresh токена",
  })
  @Column({ nullable: false })
  refresh: string;
}
