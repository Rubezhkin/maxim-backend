import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.model";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(login: string) {
    const user = await this.userRepository.findOneBy({ login });
    return user;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async update(login: string, updateUserDto: Partial<UpdateUserDto>) {
    const user = await this.findOne(login);
    if (user) {
      Object.assign(user, updateUserDto);
      return this.userRepository.save(user);
    }
  }

  async remove(login: string) {
    const user = await this.findOne(login);
    if (user) {
      await this.userRepository.remove(user);
    }
  }
}
