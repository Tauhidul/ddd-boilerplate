import { Injectable } from '@nestjs/common';
import { DispatchDueJobsPort } from '../ports/dispatch-due-jobs.port';
import { DispatchDueJobsUseCase } from '../usecases/dispatch-due-jobs.usecase';

@Injectable()
export class DispatchDueJobsAdapter implements DispatchDueJobsPort {
  constructor(private readonly useCase: DispatchDueJobsUseCase) {}

  execute(options?: { batchSize?: number; timeBudgetMs?: number }): Promise<number> {
    return this.useCase.execute(options);
  }
}
