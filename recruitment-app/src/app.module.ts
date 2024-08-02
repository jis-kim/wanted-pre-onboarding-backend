import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
