import type { TypeGuard, TransformFunction } from 'r-assign';

/**
 * Transform any value to boolean
 */
export declare const asBoolean: TransformFunction<boolean>;

/**
 * Check for boolean values
 */
export declare const isBoolean: TypeGuard<boolean>;

export { isBoolean as boolean };