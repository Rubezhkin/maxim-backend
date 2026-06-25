import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.model";
import { Repository } from "typeorm";
import { CreateUserDto } from "./create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(login: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ login });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async update(
    login: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const user = await this.findOne(login);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(login: string): Promise<void> {
    const user = await this.findOne(login);
    await this.userRepository.remove(user);
  }
}
