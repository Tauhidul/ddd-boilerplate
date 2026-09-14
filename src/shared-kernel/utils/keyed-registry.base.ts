/**
 * Shared skeleton behind the platform's service-locator registries
 * (BatchOperationHandlerRegistry, ImportHandlerRegistry, ScheduledJobHandlerRegistry):
 * a Map-backed store keyed by string, guarding duplicate registration and
 * missing-key lookups. Each registry still owns its own value shape,
 * domain-specific validation, and health()/introspection formatting.
 */
export abstract class KeyedRegistryBase<TValue> {
  protected readonly entries = new Map<string, TValue>();

  protected registerEntry(key: string, value: TValue, onDuplicate: () => Error): void {
    if (this.entries.has(key)) {
      throw onDuplicate();
    }
    this.entries.set(key, value);
  }

  protected getEntry(key: string): TValue | undefined {
    return this.entries.get(key);
  }

  protected requireEntry(key: string, onMissing: () => Error): TValue {
    const entry = this.entries.get(key);
    if (!entry) {
      throw onMissing();
    }
    return entry;
  }

  has(key: string): boolean {
    return this.entries.has(key);
  }

  registeredKeys(): string[] {
    return [...this.entries.keys()];
  }
}
