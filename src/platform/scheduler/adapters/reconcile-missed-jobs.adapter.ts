import { Injectable } from '@nestjs/common';
import { ReconcileMissedJobsPort } from '../ports/reconcile-missed-jobs.port';
import { ReconcileMissedJobsUseCase } from '../usecases/reconcile-missed-jobs.usecase';

@Injectable()
export class ReconcileMissedJobsAdapter implements ReconcileMissedJobsPort {
  constructor(private readonly useCase: ReconcileMissedJobsUseCase) {}

  execute(): Promise<number> {
    return this.useCase.execute();
  }
}
