import { registerDecorator, type ValidationOptions } from 'class-validator';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates a calendar date in strict "YYYY-MM-DD" form, with no time component.
 * Unlike class-validator's `@IsDateString()` — which also accepts full ISO
 * timestamps like "2026-06-25T12:00:00Z" — this keeps date-only `pg date` columns
 * and the "YYYY-MM-DD" text contract intact: a stray timestamp would otherwise be
 * stored truncated yet fail later exact-date lookups. Also rejects impossible
 * dates such as "2026-02-31".
 */
export const IsIsoDate =
  (options?: ValidationOptions) => (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isIsoDate',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string' || !ISO_DATE.test(value)) return false;
          const date = new Date(`${value}T00:00:00Z`);
          if (Number.isNaN(date.getTime())) return false;
          // Round-trip guards against overflow (e.g. "2026-02-31" rolling over).
          return date.toISOString().slice(0, 10) === value;
        },
        defaultMessage() {
          return `${propertyName} must be a date in YYYY-MM-DD format`;
        },
      },
    });
  };
