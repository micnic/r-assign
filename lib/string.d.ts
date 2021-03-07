import type { TransformFunction } from 'r-assign';

/**
 * Check for string values
 */
const isString: (value: any) => value is string;

/**
 * Transform function to validate string values
 */
const parseString: TransformFunction<string>;

/**
 * Creator of transform functions for string values
 */
const useString: (initial?: string) => TransformFunction<string>;

export {
	isString,
	parseString,
	useString
};