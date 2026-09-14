import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const REQUEST_STATUSES = [
  'PENDING',
  'RUNNING',
  'COMPLETED',
  'COMPLETED_WITH_ERRORS',
  'FAILED',
  'NO_RECIPIENTS',
] as const;

export const notifySchema = z.object({
  notificationType: z.string().min(1),
  dedupKey: z.string().min(1),
  payload: z.record(z.string(), z.unknown()).optional(),
  sourceEvent: z.string().optional(),
  priority: z.enum(['HIGH', 'NORMAL', 'LOW']).optional(),
});
export class NotifyDto extends createZodDto(notifySchema) {}

export const notificationQuerySchema = z.object({
  status: z.enum(REQUEST_STATUSES).optional(),
  notificationType: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).optional(),
});
export class NotificationQueryDto extends createZodDto(notificationQuerySchema) {}

export const upsertPreferenceSchema = z.object({
  recipientRef: z.string().min(1),
  category: z.string().min(1),
  channel: z.string().min(1),
  optedIn: z.boolean(),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
  timezone: z.string().optional(),
});
export class UpsertPreferenceDto extends createZodDto(upsertPreferenceSchema) {}

export const deliveryWebhookSchema = z.record(z.string(), z.unknown());
export class DeliveryWebhookDto extends createZodDto(deliveryWebhookSchema) {}
