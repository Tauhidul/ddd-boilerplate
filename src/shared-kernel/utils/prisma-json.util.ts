/**
 * JSON round-trip that produces a plain JSON value satisfying Prisma's
 * InputJsonValue — the generated @ts-nocheck types don't expose this to tsc,
 * so every Prisma repository needs it when writing a JSON column.
 */
export function toPrismaJson(value: unknown): object | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return JSON.parse(JSON.stringify(value)) as object;
}
