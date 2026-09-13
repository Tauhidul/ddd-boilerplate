import { Injectable } from '@nestjs/common';
import { CancelBatchOperationJobPort } from '../ports/cancel-batch-operation-job.port';
import { CancelBatchOperationJobUseCase } from '../usecases/cancel-batch-operation-job.usecase';
import { BatchOperationJobRecord } from '../batch-operation.types';

@Injectable()
export class CancelBatchOperationJobAdapter implements CancelBatchOperationJobPort {
  constructor(private readonly useCase: CancelBatchOperationJobUseCase) {}

  execute(jobId: string): Promise<BatchOperationJobRecord> {
    return this.useCase.execute(jobId);
  }
}
