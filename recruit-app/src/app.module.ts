import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ApplicationsModule } from './applications/applications.module';
import { CompaniesModule } from './companies/companies.module';
import { Application, Company, Job, User } from './entities';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        autoLoadEntities: true, // module에 있는 모든 entity를 감지
        logging: true,
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(), // 코드는 camelCase, DB는 snake_case
      }),
    }),
    TypeOrmModule.forFeature([Application, Company, Job, User]),
    JobsModule,
    CompaniesModule,
    UsersModule,
    ApplicationsModule,
  ],
})
export class AppModule {}
