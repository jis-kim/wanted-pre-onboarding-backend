import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import seeder from './seeder/seeder';

config();

// seeding 10 companies
(async () => {
  const options: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    entities: ['src/entities/*.ts'],
    namingStrategy: new SnakeNamingStrategy(),
  };

  let dataSource: DataSource = new DataSource(options);

  try {
    await dataSource.initialize();
  } catch (e) {
    console.table(e);
    console.error(e);
    if (e.code === 'ENOTFOUND') {
      console.error(
        'Please check the database connection options in the .env file.\n',
      );
    }
    await dataSource.destroy();
    process.exit(1);
  }
  try {
    await seeder.createCompanies(dataSource);
    await seeder.createUsers(dataSource);
  } catch (e) {
    console.error(e);
    if (e.code === '23505') {
      // already exists
      console.error('\nSeeding data already exists.\n');
    }
    await dataSource.destroy();
    process.exit(1);
  }
  await dataSource.destroy();
})();
