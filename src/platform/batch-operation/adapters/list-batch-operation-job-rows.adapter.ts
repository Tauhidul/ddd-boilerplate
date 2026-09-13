import { Injectable } from '@nestjs/common';
import { ListBatchOperationJobRowsPort } from '../ports/list-batch-operation-job-rows.port';
import { ListBatchOperationJobRowsUseCase } from '../usecases/list-batch-operation-job-rows.usecase';
import { BatchOperationRowRecord } from '../batch-operation.types';

@Injectable()
export class ListBatchOperationJobRowsAdapter implements ListBatchOperationJobRowsPort {
  constructor(private readonly useCase: ListBatchOperationJobRowsUseCase) {}

  execute(jobId: string): Promise<BatchOperationRowRecord[]> {
    return this.useCase.execute(jobId);
  }
}
