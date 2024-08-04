import {
  IsDateString,
  IsNumberString,
  IsString,
  Length,
  Max,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @Length(3, 20)
  position: string;

  @IsString()
  @Length(0, 255)
  skills: string;

  @IsNumberString()
  @Max(10000000)
  reward: number;

  @IsString()
  @Length(0, 10000)
  description: string;

  @IsDateString()
  dueDate: Date;

  @IsString()
  companyId: string;
}
