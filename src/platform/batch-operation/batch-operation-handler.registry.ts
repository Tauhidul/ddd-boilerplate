import { Injectable } from '@nestjs/common';
import { KeyedRegistryBase } from '@shared-kernel/utils/keyed-registry.base';
import { BatchOperationHandler } from './ports/batch-operation-handler.port';
import {
  BatchHandlerOperationMismatchError,
  DuplicateBatchHandlerRegistrationError,
  UnregisteredBatchHandlerError,
  UnsupportedBatchOperationError,
} from './batch-operation.errors';

interface RegisteredEntry {
  aggregateType: string;
  supportedOperations: string[];
  handler: BatchOperationHandler;
}

/**
 * Map<aggregateType, handler>, resolved by string key at runtime — the same
 * service-locator pattern as ScheduledJobHandlerRegistry. Populated by
 * the owning aggregate modules' bootstrap registrations; every
 * pipeline component (Service / Worker) resolves through this and never
 * branches on aggregateType or operationCode itself.
 */
@Injectable()
export class BatchOperationHandlerRegistry extends KeyedRegistryBase<RegisteredEntry> {
  /**
   * Called once per aggregateType at boot. Validates that the handler reports
   * every operationCode the registration claims — a mismatch throws here, not
   * on the first row that hits it.
   */
  register(
    aggregateType: string,
    supportedOperations: string[],
    handler: BatchOperationHandler,
  ): void {
    if (this.has(aggregateType)) {
      throw new DuplicateBatchHandlerRegistrationError(aggregateType);
    }

    const reported = new Set(handler.supportedOperations());
    const missing = supportedOperations.filter(op => !reported.has(op));
    if (missing.length > 0) {
      throw new BatchHandlerOperationMismatchError(aggregateType, missing);
    }

    this.entries.set(aggregateType, { aggregateType, supportedOperations, handler });
  }

  resolveHandler(aggregateType: string): BatchOperationHandler {
    return this.requireEntry(aggregateType, () => new UnregisteredBatchHandlerError(aggregateType))
      .handler;
  }

  assertOperationSupported(aggregateType: string, operationCode: string): void {
    const entry = this.requireEntry(
      aggregateType,
      () => new UnregisteredBatchHandlerError(aggregateType),
    );
    if (!entry.supportedOperations.includes(operationCode)) {
      throw new UnsupportedBatchOperationError(aggregateType, operationCode);
    }
  }

  /** Health indicator — makes "why can't I bulk-cancel Bills" a five-second diagnosis. */
  health(): Array<{ aggregateType: string; supportedOperations: string[] }> {
    return [...this.entries.values()].map(({ aggregateType, supportedOperations }) => ({
      aggregateType,
      supportedOperations: [...supportedOperations],
    }));
  }
}
