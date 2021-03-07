import type { TransformFunction } from 'r-assign';

/**
 * Check for bigint values
 */
const isBigInt: (value: any) => value is bigint;

/**
 * Transform function to validate bigint values
 */
const parseBigInt: TransformFunction<bigint>;

/**
 * Creator of transform functions for bigint values
 */
const useBigInt: (initial?: bigint) => TransformFunction<bigint>;

export {
	isBigInt,
	parseBigInt,
	useBigInt
};