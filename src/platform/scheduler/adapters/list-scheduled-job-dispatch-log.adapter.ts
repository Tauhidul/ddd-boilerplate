import { Injectable } from '@nestjs/common';
import { ListScheduledJobDispatchLogPort } from '../ports/list-scheduled-job-dispatch-log.port';
import { ListScheduledJobDispatchLogUseCase } from '../usecases/list-scheduled-job-dispatch-log.usecase';
import { ScheduledJobDispatchLogRecord } from '../scheduler.types';

@Injectable()
export class ListScheduledJobDispatchLogAdapter implements ListScheduledJobDispatchLogPort {
  constructor(private readonly useCase: ListScheduledJobDispatchLogUseCase) {}

  execute(
    jobId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<ScheduledJobDispatchLogRecord[]> {
    return this.useCase.execute(jobId, options);
  }
}
