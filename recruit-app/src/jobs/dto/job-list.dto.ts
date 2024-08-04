export class JobInfo {
  jobId: string;
  position: string;
  skills: string;
  country: string;
  region: string;
  dueDate: Date;
  companyId: string;
  companyName: string;
}

export class JobListDto {
  total?: number;
  jobs: JobInfo[];
}
