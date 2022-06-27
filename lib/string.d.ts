import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Transform any value to string
 */
declare const asString: TransformFunction<string>;

/**
 * Transform any value to string
 * @deprecated will be removed in version 2.0, use "asString()" instead
 */
declare function convertToString(
	value?: unknown,
	key?: string,
	source?: unknown
): string;

/**
 * Extract string values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getString(initial?: string): TransformFunction<string>;

/**
 * Check for string values
 */
declare const isString: TypeGuard<string>;

/**
 * Extract and validate string values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseString(
	value?: unknown,
	key?: string,
	source?: unknown
): string;

export {
	asString,
	convertToString,
	getString,
	isString,
	isString as string,
	parseString
};