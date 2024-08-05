export class JobDetailDto {
  jobId: string;
  createdAt: Date;
  updatedAt: Date;
  position: string;
  skills: string;
  reward: number;
  description: string;
  country: string;
  region: string;
  dueDate: Date;
  companyId: string;

  company: {
    companyId: string;
    companyName: string;
    jobs: {
      jobId: string;
      position: string;
    }[];
  };
}
