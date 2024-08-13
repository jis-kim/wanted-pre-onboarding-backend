import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findAll() {
    return this.companyRepository.find();
  }

  async findOneById(companyId: string) {
    return this.companyRepository.findOneBy({ companyId });
  }
}
