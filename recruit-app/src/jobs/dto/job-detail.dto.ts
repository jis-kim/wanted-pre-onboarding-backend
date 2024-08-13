export class JobDetailDto {
  jobId: string;
  position: string;
  skills: string;
  reward: number;
  description: string;
  country: string;
  region: string;
  dueDate: Date;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  company: {
    companyId: string;
    companyName: string;
    jobs: {
      jobId: string;
      position: string;
    }[];
  };
}
