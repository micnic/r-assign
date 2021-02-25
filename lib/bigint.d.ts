import type { TransformFunction } from 'r-assign';

/**
 * Check for bigint values
 */
const isBigInt: (value: any) => value is bigint;

/**
 * Creator of transform functions for bigint values
 */
const useBigInt: (initial?: bigint) => TransformFunction<bigint>;

/**
 * Transform function to validate bigint values
 */
const validateBigInt: TransformFunction<big>;

export {
	isBigInt,
	useBigInt,
	validateBigInt
};