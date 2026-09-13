import { Injectable } from '@nestjs/common';
import { GetBatchOperationJobStatusPort } from '../ports/get-batch-operation-job-status.port';
import { GetBatchOperationJobStatusUseCase } from '../usecases/get-batch-operation-job-status.usecase';
import { BatchOperationJobRecord } from '../batch-operation.types';

@Injectable()
export class GetBatchOperationJobStatusAdapter implements GetBatchOperationJobStatusPort {
  constructor(private readonly useCase: GetBatchOperationJobStatusUseCase) {}

  execute(jobId: string): Promise<BatchOperationJobRecord> {
    return this.useCase.execute(jobId);
  }
}
