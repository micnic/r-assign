import type { TransformFunction } from 'r-assign';

/**
 * Check for non-undefined values
 */
declare function isAny(value: any): value is Exclude<any, undefined>;

/**
 * Creator of transform functions for non-undefined values
 */
declare function useAny(initial?: any): TransformFunction;

export {
	isAny,
	useAny
};