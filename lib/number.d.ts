import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Extract number values
 * @deprecated will be removed in version 2.0, use getType instead
 */
declare function getAnyNumber(initial?: number): TransformFunction<number>;

/**
 * Extract finite number values
 * @deprecated will be removed in version 2.0, use getType instead
 */
declare function getNumber(initial?: number): TransformFunction<number>;

/**
 * Check for number values
 */
declare const isAnyNumber: TypeGuard<number>;

/**
 * Check for finite number values
 */
declare const isNumber: TypeGuard<number>;

/**
 * Extract and validate number values
 * @deprecated will be removed in version 2.0, use parseType instead
 */
declare const parseAnyNumber: TransformFunction<number>;

/**
 * Extract and validate finite number values
 * @deprecated will be removed in version 2.0, use parseType instead
 */
declare const parseNumber: TransformFunction<number>;

export {
	getAnyNumber,
	getNumber,
	isAnyNumber,
	isNumber,
	parseAnyNumber,
	parseNumber
};