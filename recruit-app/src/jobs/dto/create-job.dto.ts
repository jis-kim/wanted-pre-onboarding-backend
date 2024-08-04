import { IsDateString, IsNumber, IsString, Length, Max } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @Length(3, 255)
  position: string;

  @IsString()
  @Length(0, 512)
  skills: string;

  @IsNumber()
  @Max(10_000_000)
  reward: number;

  @IsString()
  @Length(0, 10_000)
  description: string;

  @IsString()
  @Length(0, 255)
  country: string;

  @IsString()
  @Length(0, 255)
  region: string;

  @IsDateString()
  dueDate: Date;

  @IsString()
  companyId: string;
}
