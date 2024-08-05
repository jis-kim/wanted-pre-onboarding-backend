import { IsString, Length } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @Length(21, 21)
  jobId: string;

  @IsString()
  @Length(21, 21)
  userId: string;

  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @Length(1, 10_000)
  content: string;
}
