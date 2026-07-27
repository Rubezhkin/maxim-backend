import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.model";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserDto } from "./dto/get-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const user = await this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => new GetUserDto(user.id, user.login));
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findOneByLogin(login: string) {
    const user = await this.userRepository.findOneBy({ login });
    return user;
  }

  async findOneRequest(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return new GetUserDto(user.id, user.login);
    } else {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    if (!updatedUser) {
      throw new HttpException("Ошибка обновления", HttpStatus.BAD_REQUEST);
    }
    return this.findOneRequest(updatedUser.id);
  }

  async updatePassword(id: number, hashedPassword: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (user) {
      await this.userRepository.remove(user);
    }
  }
}
