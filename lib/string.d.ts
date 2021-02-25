import type { TransformFunction } from 'r-assign';

/**
 * Check for string values
 */
declare function isString(value: any): value is string;

/**
 * Creator of transform functions for string values
 */
declare function useString(initial?: string): TransformFunction<string>;

export {
	isString,
	useString
};