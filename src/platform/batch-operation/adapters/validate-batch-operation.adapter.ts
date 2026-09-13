import { Injectable } from '@nestjs/common';
import { ValidateBatchOperationPort } from '../ports/validate-batch-operation.port';
import { ValidateBatchOperationUseCase } from '../usecases/validate-batch-operation.usecase';
import { BatchOperationPreview, ValidateBatchOperationInput } from '../batch-operation.types';

@Injectable()
export class ValidateBatchOperationAdapter implements ValidateBatchOperationPort {
  constructor(private readonly useCase: ValidateBatchOperationUseCase) {}

  execute(input: ValidateBatchOperationInput): Promise<BatchOperationPreview> {
    return this.useCase.execute(input);
  }
}
