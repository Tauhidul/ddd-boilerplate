import { Injectable } from '@nestjs/common';
import { GetScheduledJobStatusPort } from '../ports/get-scheduled-job-status.port';
import { GetScheduledJobStatusUseCase } from '../usecases/get-scheduled-job-status.usecase';
import { ScheduledJobRecord } from '../scheduler.types';

@Injectable()
export class GetScheduledJobStatusAdapter implements GetScheduledJobStatusPort {
  constructor(private readonly useCase: GetScheduledJobStatusUseCase) {}

  execute(jobId: string): Promise<ScheduledJobRecord> {
    return this.useCase.execute(jobId);
  }

  list(options?: {
    jobType?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ScheduledJobRecord[]> {
    return this.useCase.list(options);
  }
}
