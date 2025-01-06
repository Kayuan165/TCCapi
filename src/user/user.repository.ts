import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  public users: User[];
  constructor() {
    this.users = [];
  }

  private convertToUser(createUser: CreateUserDto): User {
    const user = new User();

    user.email = createUser.email;
    user.password = createUser.password;
    user.name = createUser.name;
    return user;
  }

  create(createUser: CreateUserDto): User {
    const user = this.convertToUser(createUser);
    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((user) => user.id === id);

    if (!user) throw new NotFoundException();
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);

    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.email) user.email = updateUserDto.email;
    return user;
  }

  remove(id: number) {
    const index = this.users.findIndex((prop) => prop.id === id);
    if (index < 0) throw new NotFoundException();
    this.users.splice(index, 1);
  }
}
