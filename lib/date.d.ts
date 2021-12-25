import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

declare const convertToAnyDate: TransformFunction<Date>;
declare const convertToDate: TransformFunction<Date>;

/**
 * Check for date values
 */
declare const isAnyDate: TypeGuard<Date>;

/**
 * Check for valid date values
 */
declare const isDate: TypeGuard<Date>;

export { convertToAnyDate, convertToDate, isAnyDate, isDate };