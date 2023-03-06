import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign';

/**
 * Transform number or string values to valid date
 */
export declare const asDate: TransformFunction<Date>;

/**
 * Check for valid date values
 */
export declare const isDate: TypeGuard<Date>;

export { isDate as date };