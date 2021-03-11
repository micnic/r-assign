import type { TransformFunction } from 'r-assign';

/**
 * Check for bigint values
 */
declare const isBigInt: (value: any) => value is bigint;

/**
 * Transform function to validate bigint values
 */
declare const parseBigInt: TransformFunction<bigint>;

/**
 * Creator of transform functions for bigint values
 */
declare const useBigInt: (initial?: bigint) => TransformFunction<bigint>;

export { isBigInt, parseBigInt, useBigInt };