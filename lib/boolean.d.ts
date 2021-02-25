import type { TransformFunction } from 'r-assign';

/**
 * Check for boolean values
 */
declare function isBoolean(value: any): value is boolean;

/**
 * Creator of transform functions for boolean values
 */
declare function useBoolean(initial?: boolean): TransformFunction<boolean>;

export {
	isBoolean,
	useBoolean
};