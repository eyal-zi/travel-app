import { registerDecorator, type ValidationOptions } from 'class-validator';

export const IsFeatureCollection =
  (options?: ValidationOptions) => (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isFeatureCollection',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: unknown) {
          return (
            typeof value === 'object' &&
            value !== null &&
            (value as { type?: unknown }).type === 'FeatureCollection' &&
            Array.isArray((value as { features?: unknown }).features)
          );
        },
        defaultMessage() {
          return `${propertyName} must be a GeoJSON FeatureCollection`;
        },
      },
    });
  };
