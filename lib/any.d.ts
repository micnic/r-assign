import type { TransformFunction } from 'r-assign';

/**
 * Check for non-undefined values
 */
declare const isAny: (value: any) => value is Exclude<any, undefined>;

/**
 * Creator of transform functions for non-undefined values
 */
declare const useAny: (initial?: any) => TransformFunction;

/**
 * Transform function to validate non-undefined values
 */
declare const validateAny: TransformFunction;

export {
	isAny,
	useAny,
	validateAny
};