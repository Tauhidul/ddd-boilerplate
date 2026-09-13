import { Injectable } from '@nestjs/common';
import { BatchOperationJobRepositoryPort } from '../ports/batch-operation-job-repository.port';
import { BatchOperationJobRowRepositoryPort } from '../ports/batch-operation-job-row-repository.port';
import { BatchOperationJobNotFoundError } from '../batch-operation.errors';
import { BatchOperationRowRecord } from '../batch-operation.types';

/** Row-level detail for audit / failure drill-down. */
@Injectable()
export class ListBatchOperationJobRowsUseCase {
  constructor(
    private readonly jobs: BatchOperationJobRepositoryPort,
    private readonly rows: BatchOperationJobRowRepositoryPort,
  ) {}

  async execute(jobId: string): Promise<BatchOperationRowRecord[]> {
    const job = await this.jobs.findJob(jobId);
    if (!job) {
      throw new BatchOperationJobNotFoundError(jobId);
    }
    return this.rows.findRowsByJobId(jobId);
  }
}
