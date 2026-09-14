import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ContextModule } from '@platform/context/context.module';
import { ObservabilityModule } from '@platform/observability/observability.module';
import { OutboxModule } from '@platform/outbox/outbox.module';
import { NotificationModule as InfraNotificationModule } from '@infrastructure/notification/notification.module';
import { ChannelProviderRegistry } from './channel-provider.registry';
import { NotificationHandlerRegistry } from './notification-handler.registry';
import { NotificationEventDispatcher } from './notification-event.dispatcher';
import { NotificationReconciliationConsumer } from './notification-reconciliation.consumer';
import { NotificationWorker } from './notification.worker';
import { TemplateRenderer } from './template-renderer';
import { NOTIFICATION_QUEUE_NAME } from './notification.constants';
import { NotificationMessageRepositoryPort } from './ports/notification-message-repository.port';
import { NotificationOutboxWriterPort } from './ports/notification-outbox-writer.port';
import { NotificationPreferenceRepositoryPort } from './ports/notification-preference-repository.port';
import { NotificationQueuePublisherPort } from './ports/notification-queue-publisher.port';
import { NotificationRequestRepositoryPort } from './ports/notification-request-repository.port';
import { NotificationSuppressionRepositoryPort } from './ports/notification-suppression-repository.port';
import { NotificationTemplateRepositoryPort } from './ports/notification-template-repository.port';
import { ApplyDeliveryEventUseCase } from './usecases/apply-delivery-event.usecase';
import { FinaliseNotificationRequestUseCase } from './usecases/finalise-notification-request.usecase';
import { GetNotificationStatusUseCase } from './usecases/get-notification-status.usecase';
import { ListNotificationPreferencesUseCase } from './usecases/list-notification-preferences.usecase';
import { ListNotificationsUseCase } from './usecases/list-notifications.usecase';
import { RenderAndSendMessageUseCase } from './usecases/render-and-send-message.usecase';
import { SendNotificationUseCase } from './usecases/send-notification.usecase';
import { UpsertNotificationPreferenceUseCase } from './usecases/upsert-notification-preference.usecase';
import { BullMqNotificationQueuePublisher } from './adapters/bullmq-notification-queue.publisher';
import { BullMqNotificationWorker } from './adapters/bullmq-notification.worker';
import { PrismaNotificationOutboxWriter } from './adapters/prisma-notification-outbox.writer';
import { PrismaNotificationRepository } from './adapters/prisma-notification.repository';
import { SesEmailChannelProvider } from './adapters/ses-email-channel.provider';
import { SnsPushChannelProvider, SnsSmsChannelProvider } from './adapters/sns-channel.provider';
import { NotificationController } from './http/notification.controller';

/**
 * Platform notification — the one shared way the platform reaches a human
 * outside the app (Email/SMS/Push) in response to a domain event or an
 * explicit send. A notification-emitting domain module opts in by
 * registering with NotificationHandlerRegistry from its own
 * onApplicationBootstrap, the same direct way batch-operation/recurring
 * aggregates register themselves — never the reverse import.
 */
@Module({
  imports: [
    ContextModule,
    OutboxModule,
    ObservabilityModule,
    InfraNotificationModule,
    BullModule.registerQueue({ name: NOTIFICATION_QUEUE_NAME }),
  ],
  controllers: [NotificationController],
  providers: [
    ChannelProviderRegistry,
    NotificationHandlerRegistry,
    PrismaNotificationRepository,
    { provide: NotificationRequestRepositoryPort, useExisting: PrismaNotificationRepository },
    { provide: NotificationMessageRepositoryPort, useExisting: PrismaNotificationRepository },
    { provide: NotificationTemplateRepositoryPort, useExisting: PrismaNotificationRepository },
    { provide: NotificationPreferenceRepositoryPort, useExisting: PrismaNotificationRepository },
    { provide: NotificationSuppressionRepositoryPort, useExisting: PrismaNotificationRepository },
    PrismaNotificationOutboxWriter,
    { provide: NotificationOutboxWriterPort, useExisting: PrismaNotificationOutboxWriter },
    BullMqNotificationQueuePublisher,
    { provide: NotificationQueuePublisherPort, useExisting: BullMqNotificationQueuePublisher },
    BullMqNotificationWorker,
    NotificationWorker,
    NotificationReconciliationConsumer,
    NotificationEventDispatcher,
    TemplateRenderer,
    SesEmailChannelProvider,
    SnsSmsChannelProvider,
    SnsPushChannelProvider,
    SendNotificationUseCase,
    RenderAndSendMessageUseCase,
    ApplyDeliveryEventUseCase,
    FinaliseNotificationRequestUseCase,
    GetNotificationStatusUseCase,
    ListNotificationsUseCase,
    ListNotificationPreferencesUseCase,
    UpsertNotificationPreferenceUseCase,
  ],
  exports: [NotificationHandlerRegistry, ChannelProviderRegistry, SendNotificationUseCase],
})
export class NotificationModule {
  constructor(
    private readonly channelProviders: ChannelProviderRegistry,
    private readonly sesEmailChannelProvider: SesEmailChannelProvider,
    private readonly snsSmsChannelProvider: SnsSmsChannelProvider,
    private readonly snsPushChannelProvider: SnsPushChannelProvider,
  ) {
    // Runs during DI graph construction — strictly before any module's
    // onApplicationBootstrap fires anywhere in the app — so
    // NotificationHandlerRegistry.register() can safely validate a domain
    // module's declared channels against this registry the moment that
    // domain module's own onApplicationBootstrap calls it.
    this.channelProviders.register('EMAIL', this.sesEmailChannelProvider);
    this.channelProviders.register('SMS', this.snsSmsChannelProvider);
    this.channelProviders.register('PUSH', this.snsPushChannelProvider);
  }
}
