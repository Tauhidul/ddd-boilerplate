import { Injectable } from '@nestjs/common';
import { ScheduledJobDispatchLogRepositoryPort } from '../ports/scheduled-job-dispatch-log-repository.port';
import { ScheduledJobDispatchLogRecord } from '../scheduler.types';

@Injectable()
export class ListScheduledJobDispatchLogUseCase {
  constructor(private readonly logs: ScheduledJobDispatchLogRepositoryPort) {}

  execute(
    jobId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<ScheduledJobDispatchLogRecord[]> {
    return this.logs.listByJobId(jobId, options);
  }
}
