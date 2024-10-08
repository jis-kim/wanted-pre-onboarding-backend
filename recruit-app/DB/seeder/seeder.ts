import { DataSource } from 'typeorm';
import companyFactory from './company.factory';
import userFactory from './user.factory';
import { Company, User } from '../../src/entities';

async function createCompanies(dataSource: DataSource) {
  await dataSource.transaction(async (manager) => {
    // Create 10 companies
    const companyRepository = manager.getRepository(Company);
    const companySeed = await Promise.all(
      Array(10).fill(null).map(companyFactory),
    );
    const result = await companyRepository.insert(companySeed);
    console.log('10 companies created!\n', result.identifiers);
  });
}

async function createUsers(dataSource: DataSource) {
  await dataSource.transaction(async (manager) => {
    // Create 10 users
    const userRepository = manager.getRepository(User);
    const userSeed = await Promise.all(Array(10).fill(null).map(userFactory));
    const result = await userRepository.insert(userSeed);
    console.log('10 users created!\n', result.identifiers);
  });
}

export default { createCompanies, createUsers };
