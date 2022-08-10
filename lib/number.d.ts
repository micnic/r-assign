import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Extract number values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getAnyNumber(initial?: number): TransformFunction<number>;

/**
 * Extract finite number values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getNumber(initial?: number): TransformFunction<number>;

/**
 * Check for number values
 * @deprecated will be removed in version 2.0
 */
declare const isAnyNumber: TypeGuard<number>;

/**
 * Check for finite number values
 */
declare const isNumber: TypeGuard<number>;

/**
 * Extract and validate number values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseAnyNumber(
	value?: unknown,
	key?: string,
	source?: unknown
): number;

/**
 * Extract and validate finite number values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseNumber(
	value?: unknown,
	key?: string,
	source?: unknown
): number;

export {
	getAnyNumber,
	getNumber,
	isAnyNumber,
	isAnyNumber as anyNumber,
	isNumber,
	isNumber as number,
	parseAnyNumber,
	parseNumber
};