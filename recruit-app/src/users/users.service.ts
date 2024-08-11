import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findOneById(userId: string) {
    return this.userRepository.findOneBy({ userId });
  }

  findAll() {
    return this.userRepository.find();
  }
}
