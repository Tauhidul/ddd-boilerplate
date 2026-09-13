import { SchedulerAdapter } from './adapters/scheduler.adapter';
import { RegisterScheduledJobUseCase } from './usecases/register-scheduled-job.usecase';
import { CancelScheduledJobUseCase } from './usecases/cancel-scheduled-job.usecase';
import { RescheduleExternalJobUseCase } from './usecases/reschedule-external-job.usecase';
import { JobScope, ScheduleMode } from './scheduler.types';
import { ScheduledJobHandlerRegistry } from './scheduled-job-handler.registry';

describe('scheduler wiring smoke', () => {
  it('SchedulerAdapter maps schedule to AGGREGATE + EXTERNAL register', async () => {
    const execute = jest.fn().mockResolvedValue('job-id');
    const registerUseCase = { execute } as unknown as RegisterScheduledJobUseCase;
    const cancelUseCase = {} as CancelScheduledJobUseCase;
    const rescheduleUseCase = {} as RescheduleExternalJobUseCase;

    const adapter = new SchedulerAdapter(registerUseCase, cancelUseCase, rescheduleUseCase);
    const id = await adapter.schedule({
      jobType: 'Recurring',
      aggregateType: 'RecurringTemplate',
      aggregateId: 'agg-1',
      nextRunAt: new Date('2026-01-02T00:00:00.000Z'),
      tenantId: 't1',
    });

    expect(id).toBe('job-id');
    expect(execute).toHaveBeenCalledWith({
      jobType: 'Recurring',
      scope: JobScope.AGGREGATE,
      scheduleMode: ScheduleMode.EXTERNAL,
      nextRunAt: new Date('2026-01-02T00:00:00.000Z'),
      tenantId: 't1',
      aggregateType: 'RecurringTemplate',
      aggregateId: 'agg-1',
    });
  });

  it('registry accepts handler registration by jobType', () => {
    const registry = new ScheduledJobHandlerRegistry();
    registry.register('Recurring', { handle: () => Promise.resolve() });
    expect(registry.has('Recurring')).toBe(true);
  });
});
