import { Injectable } from '@nestjs/common';
import { CreateBatchOperationJobPort } from '../ports/create-batch-operation-job.port';
import { CreateBatchOperationJobUseCase } from '../usecases/create-batch-operation-job.usecase';
import { BatchOperationJobRecord, SubmitBatchOperationInput } from '../batch-operation.types';

@Injectable()
export class CreateBatchOperationJobAdapter implements CreateBatchOperationJobPort {
  constructor(private readonly useCase: CreateBatchOperationJobUseCase) {}

  execute(input: SubmitBatchOperationInput): Promise<BatchOperationJobRecord> {
    return this.useCase.execute(input);
  }
}
