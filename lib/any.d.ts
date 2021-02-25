import type { TransformFunction } from 'r-assign';

/**
 * Check for non-undefined values
 */
const isAny: (value: any) => value is Exclude<any, undefined>;

/**
 * Creator of transform functions for non-undefined values
 */
const useAny: (initial?: any) => TransformFunction;

/**
 * Transform function to validate non-undefined values
 */
const validateAny: TransformFunction;

export {
	isAny,
	useAny,
	validateAny
};