import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор пользователя",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "john_doe", description: "Логин пользователя" })
  @Column({ unique: true })
  login: string;

  @ApiProperty({
    example: "secret_password",
    description: "Пароль пользователя",
  })
  @Column()
  password: string;
}
