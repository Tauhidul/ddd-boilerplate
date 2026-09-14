# notification

The one shared way the platform reaches a human outside the app — Email,
SMS, Push — in response to a domain event (invoice approved, payment
overdue) or an explicit send. Adapted from the
`Notification_Service_Map-NestJS-v1` workbook for DB schema and business
rules only; the file architecture follows this repo's own platform-service
convention (`platform/batch-operation`, `platform/recurring`), not the
workbook's own module-wiring suggestions.

Distinct from its siblings by direction: they move records around inside the
system; this one crosses an external boundary to a third-party provider and,
uniquely, receives an asynchronous delivery receipt back later — sometimes
minutes, sometimes never.

## Shape

Flat platform-service layout — same convention as `platform/recurring`: root
classes + `events/`, `http/`, `ports/`, `usecases/`, `adapters/`,
`__testing__/`. No business-module DDD layering — this module has no
aggregate of its own.

```
root
  notification.module.ts                DI wiring; registers the built-in
                                         channel providers in its OWN
                                         constructor (runs before any
                                         module's onApplicationBootstrap)
  notification-handler.registry.ts      Map<notificationType, handler>;
                                         validates declared channels against
                                         ChannelProviderRegistry at register()
  channel-provider.registry.ts          Map<channel, provider> + health
  notification.worker.ts                thin chunk loop: resolves the model
                                         ONCE per chunk, then
                                         RenderAndSendMessageUseCase per message
  notification-reconciliation.consumer.ts   @Cron: reset stuck RENDERING,
                                         re-enqueue PENDING, flag stale SENT
  notification-event.dispatcher.ts      EVENT trigger path (mirrors
                                         recurring/domain-event.dispatcher.ts)
  template-renderer.ts                  pure {{variable}} interpolation
  notification.types.ts · notification.errors.ts · notification.constants.ts
usecases/    business logic only, one class per capability, injected
             directly by the controller/worker — no per-usecase port+adapter
  send-notification.usecase.ts          Phases 1-3: dedup, resolve handler,
                                         the gate, fan-out, Sync/Async, dispatch
  render-and-send-message.usecase.ts    Phase 5: claim, render, send, record
  apply-delivery-event.usecase.ts       Phase 6: verify, match, monotonic apply
  finalise-notification-request.usecase.ts   Phase 7: terminal status + outbox
  get-notification-status.usecase.ts · list-notifications.usecase.ts
  list-notification-preferences.usecase.ts · upsert-notification-preference.usecase.ts
ports/   only genuine boundaries — see PORTS.md
adapters/
  prisma-notification.repository.ts     one class, five repo ports
  prisma-notification-outbox.writer.ts
  bullmq-notification-queue.publisher.ts · bullmq-notification.worker.ts
  ses-email-channel.provider.ts         EMAIL, over the existing SesService
  sns-channel.provider.ts               SMS + PUSH, over the existing SnsService
  webhook-signature.util.ts · notification.mapper.ts
events/ · __testing__/
http/
  POST /notifications · GET /notifications · GET /notifications/:id ·
  GET /notifications/_registry · POST /notifications/webhooks/:channel ·
  GET /notifications/preferences/:recipientRef · PUT /notifications/preferences
```

## Onboarding a notification-emitting domain module

Inside the domain module that owns the event (never the reverse):

```ts
@Module({
  imports: [PlatformModule],
  providers: [InvoiceNotificationProvider /* + its own read-model deps */],
})
export class InvoiceModule implements OnApplicationBootstrap {
  constructor(
    private readonly notificationHandlers: NotificationHandlerRegistry,
    private readonly invoiceNotificationProvider: InvoiceNotificationProvider,
  ) {}

  onApplicationBootstrap(): void {
    this.notificationHandlers.register(
      { notificationType: 'InvoiceOverdue', channels: ['EMAIL', 'SMS'], priority: 'NORMAL' },
      this.invoiceNotificationProvider,
    );
  }
}
```

The adapter implements `resolveRecipients()`/`resolveModel()` only — it never
renders a template, calls a provider, or writes a notification table. See
`ports/notification-handler.port.ts`.

## Not yet built (workbook "OPEN" items, carried over honestly)

- **Multi-provider failover** — one provider per channel for v1.
- **Quiet hours** — `quietHoursStart/End/timezone` are stored on
  `notification_preferences` but not enforced; a quiet-hours recipient is
  contacted immediately, not deferred.
- **In-app as a fourth channel** — the notification-centre bell is a
  frontend concern outside this pipeline.
- **Digest/batching** — every notification fans out individually.
- **PII retention/redaction** — no purge job for `notification_requests` /
  `notification_messages`; `notification_suppressions` is correctly never
  purged (a compliance record), the other tables simply have no retention
  job yet.
- **Real AWS delivery-status feeds** — `sns-channel.provider.ts` accepts an
  already-normalised delivery event rather than parsing AWS's own
  CloudWatch-Logs-based SMS/push delivery reporting; `ses-email-channel.provider.ts`
  does parse the real SES bounce/complaint/delivery notification shape.
- **Full SNS message signature verification** — `webhook-signature.util.ts`
  is an HMAC shared-secret check, not AWS SNS's certificate-chain scheme.
