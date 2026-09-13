import { Injectable } from '@nestjs/common';
import { ProcessBatchOperationRowPort } from '../ports/process-batch-operation-row.port';
import { ProcessBatchOperationRowUseCase } from '../usecases/process-batch-operation-row.usecase';
import { BatchOperationDispatch } from '../batch-operation.types';

@Injectable()
export class ProcessBatchOperationRowAdapter implements ProcessBatchOperationRowPort {
  constructor(private readonly useCase: ProcessBatchOperationRowUseCase) {}

  execute(
    dispatch: BatchOperationDispatch,
    rowId: string,
  ): Promise<'PROCESSED' | 'SKIPPED_CLAIM' | 'CANCELLED'> {
    return this.useCase.execute(dispatch, rowId);
  }
}
