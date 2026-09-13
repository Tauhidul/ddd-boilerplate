import { Injectable } from '@nestjs/common';
import { GetSchedulerHealthMetricsPort } from '../ports/get-scheduler-health-metrics.port';
import { GetSchedulerHealthMetricsUseCase } from '../usecases/get-scheduler-health-metrics.usecase';
import { SchedulerHealthMetrics } from '../scheduler.types';

@Injectable()
export class GetSchedulerHealthMetricsAdapter implements GetSchedulerHealthMetricsPort {
  constructor(private readonly useCase: GetSchedulerHealthMetricsUseCase) {}

  execute(overdueThresholdMs?: number): Promise<SchedulerHealthMetrics> {
    return this.useCase.execute(overdueThresholdMs);
  }
}
