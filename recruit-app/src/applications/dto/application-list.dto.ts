export class ApplicationInfo {
  applicationId: string;
  userId: string;
  title: string;
  content: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  job: {
    jobId: string;
    position: string;
  };
}

export class ApplicationListDto {
  total?: number;
  applications: ApplicationInfo[];
}
