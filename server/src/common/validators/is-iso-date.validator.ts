import { registerDecorator, type ValidationOptions } from 'class-validator';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

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

          return date.toISOString().slice(0, 10) === value;
        },
        defaultMessage() {
          return `${propertyName} must be a date in YYYY-MM-DD format`;
        },
      },
    });
  };
