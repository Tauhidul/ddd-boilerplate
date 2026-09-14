import { Injectable } from '@nestjs/common';
import { UpdateScheduledJobPort } from '../ports/update-scheduled-job.port';
import { UpdateScheduledJobUseCase } from '../usecases/update-scheduled-job.usecase';
import { UpdateScheduledJobInput } from '../scheduler.types';

@Injectable()
export class UpdateScheduledJobAdapter implements UpdateScheduledJobPort {
  constructor(private readonly useCase: UpdateScheduledJobUseCase) {}

  execute(input: UpdateScheduledJobInput): Promise<void> {
    return this.useCase.execute(input);
  }
}
