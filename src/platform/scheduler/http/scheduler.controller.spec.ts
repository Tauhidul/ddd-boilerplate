import { SchedulerPort } from '../ports/scheduler.port';
import { GetScheduledJobStatusPort } from '../ports/get-scheduled-job-status.port';
import { GetSchedulerHealthMetricsPort } from '../ports/get-scheduler-health-metrics.port';
import { ListScheduledJobDispatchLogPort } from '../ports/list-scheduled-job-dispatch-log.port';
import { UpdateScheduledJobPort } from '../ports/update-scheduled-job.port';
import { JobScope, JobStatus, ScheduledJobRecord, ScheduleMode } from '../scheduler.types';
import { SchedulerController, SchedulerHealthController } from './scheduler.controller';

function aJob(): ScheduledJobRecord {
  return {
    id: 'j1',
    tenantId: null,
    jobType: 'Recurring',
    scope: JobScope.AGGREGATE,
    scheduleMode: ScheduleMode.EXTERNAL,
    cronExpression: null,
    aggregateType: 'RecurringTemplate',
    aggregateId: 'a1',
    payload: null,
    nextRunAt: new Date(),
    lastRunAt: null,
    status: JobStatus.PENDING,
    retryCount: 0,
    version: 0,
    lockedUntil: null,
    lockedBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe('SchedulerController', () => {
  it('lists jobs via getStatus port', async () => {
    const list = jest.fn().mockResolvedValue([]);
    const getStatus = { list, execute: jest.fn() } as unknown as GetScheduledJobStatusPort;
    const controller = new SchedulerController(
      getStatus,
      {} as ListScheduledJobDispatchLogPort,
      {} as UpdateScheduledJobPort,
      {} as SchedulerPort,
    );

    const result = await controller.list({});
    expect(result.data).toEqual([]);
    expect(list).toHaveBeenCalled();
  });

  it('cancels a job via the scheduler port', async () => {
    const cancel = jest.fn().mockResolvedValue(undefined);
    const scheduler = { cancel } as unknown as SchedulerPort;
    const controller = new SchedulerController(
      {} as GetScheduledJobStatusPort,
      {} as ListScheduledJobDispatchLogPort,
      {} as UpdateScheduledJobPort,
      scheduler,
    );

    const result = await controller.cancel('j1');
    expect(result.data).toEqual({ id: 'j1' });
    expect(cancel).toHaveBeenCalledWith('j1');
  });
});

describe('SchedulerHealthController', () => {
  it('returns health metrics', async () => {
    const health = {
      execute: jest.fn().mockResolvedValue({
        overdueCount: 0,
        recentDispatchFailureCount: 0,
        lastSuccessfulTickAt: null,
      }),
    } as unknown as GetSchedulerHealthMetricsPort;

    const controller = new SchedulerHealthController(health);
    const result = await controller.healthMetrics();
    expect(result.data.overdueCount).toBe(0);
  });

  it('reads a single job status', async () => {
    const getStatus = {
      execute: jest.fn().mockResolvedValue(aJob()),
      list: jest.fn(),
    } as unknown as GetScheduledJobStatusPort;
    const controller = new SchedulerController(
      getStatus,
      {} as ListScheduledJobDispatchLogPort,
      {} as UpdateScheduledJobPort,
      {} as SchedulerPort,
    );

    const result = await controller.get('j1');
    expect(result.data.id).toBe('j1');
  });
});
