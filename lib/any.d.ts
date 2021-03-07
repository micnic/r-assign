import type { TransformFunction } from 'r-assign';

/**
 * Check for non-undefined values
 */
const isAny: (value: any) => value is Exclude<any, undefined>;

/**
 * Transform function to validate non-undefined values
 */
const parseAny: TransformFunction;

/**
 * Creator of transform functions for non-undefined values
 */
const useAny: (initial?: any) => TransformFunction;

export {
	isAny,
	parseAny,
	useAny,
};