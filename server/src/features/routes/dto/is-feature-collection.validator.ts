import { registerDecorator, type ValidationOptions } from 'class-validator';

/**
 * Validates that a value is a GeoJSON FeatureCollection. This is a shallow,
 * cheap check (type tag + features array) rather than a full GeoJSON schema
 * validation, which is enough to reject obviously malformed payloads.
 */
export function IsFeatureCollection(options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
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
}
