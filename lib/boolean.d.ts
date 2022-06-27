import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Extract boolean values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getBoolean(initial?: boolean): TransformFunction<boolean>;

/**
 * Check for boolean values
 */
declare const isBoolean: TypeGuard<boolean>;

/**
 * Extract and validate boolean values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseBoolean(
	value?: unknown,
	key?: string,
	source?: unknown
): boolean;

export {
	getBoolean,
	isBoolean,
	isBoolean as boolean,
	parseBoolean
};