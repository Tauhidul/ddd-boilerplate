import { DomainEvent } from '@business/shared-business/domain/bases/event.base';
import { NotificationRequestStatus } from '../notification.types';

/** Raised when a notification request reaches a terminal status. */
export class NotificationRequestCompletedEvent extends DomainEvent {
  constructor(
    public readonly requestId: string,
    public readonly notificationType: string,
    public readonly status: NotificationRequestStatus,
    public readonly totalMessages: number,
    public readonly sentMessages: number,
    public readonly failedMessages: number,
    public readonly suppressedMessages: number,
    public readonly tenantId: string | null,
  ) {
    super();
  }
}
