import type { TypeGuard, TransformFunction } from 'r-assign';

/**
 * Transform any value to number
 */
export declare const asNumber: TransformFunction<number>;

/**
 * Check for finite number values
 */
export declare const isNumber: TypeGuard<number>;

export { isNumber as number };