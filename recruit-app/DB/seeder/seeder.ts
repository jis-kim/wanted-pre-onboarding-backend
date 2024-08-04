import { DataSource } from 'typeorm';
import companyFactory from './company.factory';
import { Company } from '../../src/entities';

export default async (dataSource: DataSource) => {
  await dataSource.transaction(async (manager) => {
    // Create 10 companies
    const companyRepository = manager.getRepository(Company);
    const companySeed = await Promise.all(
      Array(10).fill(null).map(companyFactory),
    );
    const result = await companyRepository.insert(companySeed);
    console.log('10 companies created!\n', result.identifiers);
  });
};
