import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { JobModule } from './job/job.module';
import { Job } from './entities/job.entity';
import { User } from './entities/user.entity';
import { Application } from './entities/application.entity';
import { Company } from './entities/company.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        //host: process.env.POSTGRES_HOST || 'localhost',
        //port: parseInt(process.env.POSTGRES_PORT || '5432'),
        //username: process.env.POSTGRES_USER,
        //password: process.env.POSTGRES_PASSWORD,
        //database: process.env.POSTGRES_DB,
        url: process.env.POSTGRES_URL,
        autoLoadEntities: true, // module에 있는 모든 entity를 감지
        logging: true,
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(), // 코드는 camelCase, DB는 snake_case
      }),
    }),
    TypeOrmModule.forFeature([Application, Company, Job, User]),
    JobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
