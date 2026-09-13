import { Injectable } from '@nestjs/common';
import { PresignedUpload } from '@platform/storage/ports/file-storage.port';
import { PageResult } from '@shared-kernel/types/pagination';
import {
  CancelImportJobPort,
  CreateImportJobPort,
  CreateImportUploadPort,
  ExecuteImportJobPort,
  GetImportJobStatusPort,
  GetImportPreviewPort,
  GetImportReportPort,
  InitImportPort,
  ListImportJobsPort,
  ParseImportJobPort,
  RunImportExecutionPort,
  UpdateImportMappingPort,
  ValidateImportJobPort,
} from '../ports/import.ports';
import {
  CancelImportJobUseCase,
  CreateImportJobUseCase,
  CreateImportUploadUseCase,
  ExecuteImportJobUseCase,
  GetImportJobStatusUseCase,
  GetImportPreviewUseCase,
  GetImportReportUseCase,
  InitImportUseCase,
  ListImportJobsUseCase,
  ParseImportJobUseCase,
  RunImportExecutionUseCase,
  UpdateImportMappingUseCase,
  ValidateImportJobUseCase,
} from '../usecases/import.usecases';
import {
  ColumnMapping,
  ImportDescriptor,
  ImportJobRecord,
  ImportJobRowRecord,
  ImportOptions,
} from '../import.types';

/**
 * Inbound port adapters for the import pipeline — each is a thin pass-through
 * to its usecase, so ImportModule can bind the port token to the adapter and
 * keep the usecase implementing nothing but business logic.
 */

@Injectable()
export class InitImportAdapter implements InitImportPort {
  constructor(private readonly useCase: InitImportUseCase) {}

  execute(input: { entityKey: string; tenantId?: string }): Promise<{
    descriptor: ImportDescriptor;
    limits: { maxRows: number; maxFileSizeBytes: number };
    recentJobs: ImportJobRecord[];
  }> {
    return this.useCase.execute(input);
  }
}

@Injectable()
export class CreateImportUploadAdapter implements CreateImportUploadPort {
  constructor(private readonly useCase: CreateImportUploadUseCase) {}

  execute(input: {
    entityKey: string;
    tenantId?: string;
    contentType?: string;
    idempotencyKey?: string;
  }): Promise<{ storageObjectId: string; upload: PresignedUpload }> {
    return this.useCase.execute(input);
  }
}

@Injectable()
export class CreateImportJobAdapter implements CreateImportJobPort {
  constructor(private readonly useCase: CreateImportJobUseCase) {}

  execute(input: {
    entityKey: string;
    storageObjectId: string;
    tenantId?: string;
    requestedBy?: string;
    traceId?: string;
    options?: ImportOptions;
  }): Promise<ImportJobRecord> {
    return this.useCase.execute(input);
  }
}

@Injectable()
export class GetImportPreviewAdapter implements GetImportPreviewPort {
  constructor(private readonly useCase: GetImportPreviewUseCase) {}

  execute(input: { jobId: string; tenantId?: string }): Promise<{
    job: ImportJobRecord;
    sheets: string[];
    headerRow: number;
    sourceColumns: string[];
    suggestedMapping: ColumnMapping;
    sampleRows: Record<string, unknown>[];
  }> {
    return this.useCase.execute(input);
  }
}

@Injectable()
export class UpdateImportMappingAdapter implements UpdateImportMappingPort {
  constructor(private readonly useCase: UpdateImportMappingUseCase) {}

  execute(input: {
    jobId: string;
    mapping: ColumnMapping;
    tenantId?: string;
    actor?: string;
  }): Promise<ImportJobRecord> {
    return this.useCase.execute(input);
  }
}

@Injectable()
export class GetImportReportAdapter implements GetImportReportPort {
  constructor(private readonly useCase: GetImportReportUseCase) {}

  execute(input: { jobId: string; tenantId?: string; page: number; pageSize: number }): Promise<{
    job: ImportJobRecord;
    errorRows: PageResult<ImportJobRowRecord>;
  }> {
    return this.useCase.execute(input);
  }
}

@Injectable()
export class ExecuteImportJobAdapter implements ExecuteImportJobPort {
  constructor(private readonly useCase: ExecuteImportJobUseCase) {}

  execute(input: { jobId: string; tenantId?: string; actor?: string }): Promise<ImportJobRecord> {
    return this.useCase.execute(input);
  }
}

@Injectable()
export class CancelImportJobAdapter implements CancelImportJobPort {
  constructor(private readonly useCase: CancelImportJobUseCase) {}

  execute(input: { jobId: string; tenantId?: string; actor?: string }): Promise<ImportJobRecord> {
    return this.useCase.execute(input);
  }
}

@Injectable()
export class GetImportJobStatusAdapter implements GetImportJobStatusPort {
  constructor(private readonly useCase: GetImportJobStatusUseCase) {}

  execute(input: { jobId: string; tenantId?: string }): Promise<ImportJobRecord> {
    return this.useCase.execute(input);
  }
}

@Injectable()
export class ListImportJobsAdapter implements ListImportJobsPort {
  constructor(private readonly useCase: ListImportJobsUseCase) {}

  execute(input: {
    tenantId?: string;
    status?: ImportJobRecord['status'];
    entityKey?: string;
    page: number;
    pageSize: number;
  }): Promise<PageResult<ImportJobRecord>> {
    return this.useCase.execute(input);
  }
}

@Injectable()
export class ParseImportJobAdapter implements ParseImportJobPort {
  constructor(private readonly useCase: ParseImportJobUseCase) {}

  execute(jobId: string): Promise<void> {
    return this.useCase.execute(jobId);
  }
}

@Injectable()
export class ValidateImportJobAdapter implements ValidateImportJobPort {
  constructor(private readonly useCase: ValidateImportJobUseCase) {}

  execute(jobId: string): Promise<void> {
    return this.useCase.execute(jobId);
  }
}

@Injectable()
export class RunImportExecutionAdapter implements RunImportExecutionPort {
  constructor(private readonly useCase: RunImportExecutionUseCase) {}

  execute(jobId: string): Promise<void> {
    return this.useCase.execute(jobId);
  }
}
