import { Injectable } from '@nestjs/common';
import { PageResult } from '@shared-kernel/types/pagination';
import { ListBatchOperationJobsPort } from '../ports/list-batch-operation-jobs.port';
import { ListBatchOperationJobsUseCase } from '../usecases/list-batch-operation-jobs.usecase';
import { BatchOperationJobRecord, BatchOperationListQuery } from '../batch-operation.types';

@Injectable()
export class ListBatchOperationJobsAdapter implements ListBatchOperationJobsPort {
  constructor(private readonly useCase: ListBatchOperationJobsUseCase) {}

  execute(query: BatchOperationListQuery): Promise<PageResult<BatchOperationJobRecord>> {
    return this.useCase.execute(query);
  }
}
