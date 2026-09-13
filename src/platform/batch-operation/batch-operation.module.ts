import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ContextModule } from '@platform/context/context.module';
import { NumberingModule } from '@platform/numbering/numbering.module';
import { OutboxModule } from '@platform/outbox/outbox.module';
import { BatchOperationHandlerRegistry } from './batch-operation-handler.registry';
import { BatchOperationWorker } from './batch-operation.worker';
import { BatchOperationReconciliationConsumer } from './batch-operation-reconciliation.consumer';
import { CancelBatchOperationJobPort } from './ports/cancel-batch-operation-job.port';
import { CreateBatchOperationJobPort } from './ports/create-batch-operation-job.port';
import { GetBatchOperationJobStatusPort } from './ports/get-batch-operation-job-status.port';
import { ListBatchOperationJobRowsPort } from './ports/list-batch-operation-job-rows.port';
import { ListBatchOperationJobsPort } from './ports/list-batch-operation-jobs.port';
import { ProcessBatchOperationRowPort } from './ports/process-batch-operation-row.port';
import { ValidateBatchOperationPort } from './ports/validate-batch-operation.port';
import { BatchOperationJobOutboxWriterPort } from './ports/batch-operation-job-outbox-writer.port';
import { BatchOperationJobRepositoryPort } from './ports/batch-operation-job-repository.port';
import { BatchOperationJobRowRepositoryPort } from './ports/batch-operation-job-row-repository.port';
import { BatchOperationQueuePublisherPort } from './ports/batch-operation-queue-publisher.port';
import { CancelBatchOperationJobUseCase } from './usecases/cancel-batch-operation-job.usecase';
import { CreateBatchOperationJobUseCase } from './usecases/create-batch-operation-job.usecase';
import { GetBatchOperationJobStatusUseCase } from './usecases/get-batch-operation-job-status.usecase';
import { ListBatchOperationJobRowsUseCase } from './usecases/list-batch-operation-job-rows.usecase';
import { ListBatchOperationJobsUseCase } from './usecases/list-batch-operation-jobs.usecase';
import { ProcessBatchOperationRowUseCase } from './usecases/process-batch-operation-row.usecase';
import { ValidateBatchOperationUseCase } from './usecases/validate-batch-operation.usecase';
import { PrismaBatchOperationJobOutboxWriter } from './adapters/prisma-batch-operation-job-outbox.writer';
import { PrismaBatchOperationJobRepository } from './adapters/prisma-batch-operation-job.repository';
import { BATCH_OPERATION_QUEUE_NAME } from './batch-operation.constants';
import { BullMqBatchOperationQueuePublisher } from './adapters/bullmq-batch-operation-queue.publisher';
import { BullMqBatchOperationWorker } from './adapters/bullmq-batch-operation.worker';
import { BatchOperationController } from './http/batch-operation.controller';
import { CreateBatchOperationJobAdapter } from './adapters/create-batch-operation-job.adapter';
import { ValidateBatchOperationAdapter } from './adapters/validate-batch-operation.adapter';
import { ProcessBatchOperationRowAdapter } from './adapters/process-batch-operation-row.adapter';
import { GetBatchOperationJobStatusAdapter } from './adapters/get-batch-operation-job-status.adapter';
import { ListBatchOperationJobsAdapter } from './adapters/list-batch-operation-jobs.adapter';
import { ListBatchOperationJobRowsAdapter } from './adapters/list-batch-operation-job-rows.adapter';
import { CancelBatchOperationJobAdapter } from './adapters/cancel-batch-operation-job.adapter';

/**
 * Platform batch-operation — Sync/Async bulk transitions for opted-in
 * aggregates. Aggregates register a handler with
 * the registry directly (onApplicationBootstrap) from their own module;
 * the pipeline never interprets operationCode itself.
 */
@Module({
  imports: [
    ContextModule,
    NumberingModule,
    OutboxModule,
    BullModule.registerQueue({ name: BATCH_OPERATION_QUEUE_NAME }),
  ],
  controllers: [BatchOperationController],
  providers: [
    BatchOperationHandlerRegistry,
    PrismaBatchOperationJobRepository,
    { provide: BatchOperationJobRepositoryPort, useExisting: PrismaBatchOperationJobRepository },
    { provide: BatchOperationJobRowRepositoryPort, useExisting: PrismaBatchOperationJobRepository },
    PrismaBatchOperationJobOutboxWriter,
    {
      provide: BatchOperationJobOutboxWriterPort,
      useExisting: PrismaBatchOperationJobOutboxWriter,
    },
    BullMqBatchOperationQueuePublisher,
    {
      provide: BatchOperationQueuePublisherPort,
      useExisting: BullMqBatchOperationQueuePublisher,
    },
    BullMqBatchOperationWorker,
    BatchOperationWorker,
    BatchOperationReconciliationConsumer,
    CreateBatchOperationJobUseCase,
    CreateBatchOperationJobAdapter,
    { provide: CreateBatchOperationJobPort, useExisting: CreateBatchOperationJobAdapter },
    ValidateBatchOperationUseCase,
    ValidateBatchOperationAdapter,
    { provide: ValidateBatchOperationPort, useExisting: ValidateBatchOperationAdapter },
    ProcessBatchOperationRowUseCase,
    ProcessBatchOperationRowAdapter,
    { provide: ProcessBatchOperationRowPort, useExisting: ProcessBatchOperationRowAdapter },
    GetBatchOperationJobStatusUseCase,
    GetBatchOperationJobStatusAdapter,
    { provide: GetBatchOperationJobStatusPort, useExisting: GetBatchOperationJobStatusAdapter },
    ListBatchOperationJobsUseCase,
    ListBatchOperationJobsAdapter,
    { provide: ListBatchOperationJobsPort, useExisting: ListBatchOperationJobsAdapter },
    ListBatchOperationJobRowsUseCase,
    ListBatchOperationJobRowsAdapter,
    { provide: ListBatchOperationJobRowsPort, useExisting: ListBatchOperationJobRowsAdapter },
    CancelBatchOperationJobUseCase,
    CancelBatchOperationJobAdapter,
    { provide: CancelBatchOperationJobPort, useExisting: CancelBatchOperationJobAdapter },
  ],
  exports: [
    BatchOperationHandlerRegistry,
    CreateBatchOperationJobPort,
    ValidateBatchOperationPort,
    ProcessBatchOperationRowPort,
    GetBatchOperationJobStatusPort,
    ListBatchOperationJobsPort,
    ListBatchOperationJobRowsPort,
    CancelBatchOperationJobPort,
  ],
})
export class BatchOperationModule {}
