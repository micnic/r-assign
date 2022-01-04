import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Transform number or string values to date
 */
declare const asAnyDate: TransformFunction<Date>;

/**
 * Transform number or string values to valid date
 */
declare const asDate: TransformFunction<Date>;

/**
 * Transform number or string values to date
 * @deprecated will be removed in version 2.0, use "asAnyDate()" instead
 */
declare function convertToAnyDate(
	value?: unknown,
	key?: string,
	source?: unknown
): Date;

/**
 * Transform number or string values to valid date
 * @deprecated will be removed in version 2.0, use "asDate()" instead
 */
declare function convertToDate(
	value?: unknown,
	key?: string,
	source?: unknown
): Date;

/**
 * Check for date values
 */
declare const isAnyDate: TypeGuard<Date>;

/**
 * Check for valid date values
 */
declare const isDate: TypeGuard<Date>;

export {
	asAnyDate,
	asDate,
	convertToAnyDate,
	convertToDate,
	isAnyDate,
	isAnyDate as anyDate,
	isDate,
	isDate as date
};