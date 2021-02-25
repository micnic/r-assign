import type { TransformFunction } from 'r-assign';

/**
 * Check for finite number values
 */
const isNumber: (value: any) => value is number;

/**
 * Creator of transform functions for finite number values
 */
const useNumber: (initial?: number) => TransformFunction<number>;

export {
	isNumber,
	useNumber
};