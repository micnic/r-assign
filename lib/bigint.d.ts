import type { TypeGuard, TransformFunction } from 'r-assign';

/**
 * Transform any value to BigInt
 */
export declare const asBigInt: TransformFunction<bigint>;

/**
 * Check for BigInt values
 */
export declare const isBigInt: TypeGuard<bigint>;

export { isBigInt as bigint };