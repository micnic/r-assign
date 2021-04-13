import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib/union';

/**
 * Creator of transform functions for number values
 */
declare const getAnyNumber: (initial?: number) => TransformFunction<number>;

/**
 * Creator of transform functions for finite number values
 */
declare const getNumber: (initial?: number) => TransformFunction<number>;

/**
 * Check for number values
 */
declare const isAnyNumber: TypeGuard<number>;

/**
 * Check for finite number values
 */
declare const isNumber: TypeGuard<number>;

/**
 * Transform function to validate number values
 */
declare const parseAnyNumber: TransformFunction<number>;

/**
 * Transform function to validate finite number values
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