import { Injectable } from '@nestjs/common';
import { KeyedRegistryBase } from '@shared-kernel/utils/keyed-registry.base';
import {
  ScheduledJobFireHandler,
  ScheduledJobPayload,
} from './ports/scheduled-job-fire-handler.port';
import { DuplicateHandlerRegistrationError, UnregisteredHandlerError } from './scheduler.errors';

/**
 * Keyed by jobType. Dispatch checks here first; missing entry falls back to RabbitMQ.
 */
@Injectable()
export class ScheduledJobHandlerRegistry extends KeyedRegistryBase<ScheduledJobFireHandler> {
  register(jobType: string, handler: ScheduledJobFireHandler): void {
    this.registerEntry(jobType, handler, () => new DuplicateHandlerRegistrationError(jobType));
  }

  resolveHandler(jobType: string): ScheduledJobFireHandler {
    return this.requireEntry(jobType, () => new UnregisteredHandlerError(jobType));
  }

  /** Returns true if an in-process handler fired; false if none registered. */
  async tryFire(jobType: string, payload: ScheduledJobPayload): Promise<boolean> {
    const handler = this.getEntry(jobType);
    if (!handler) {
      return false;
    }
    await handler.handle(payload);
    return true;
  }

  registeredJobTypes(): string[] {
    return this.registeredKeys();
  }
}
