import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Extract BigInt values
 */
declare const getBigInt: (initial?: bigint) => TransformFunction<bigint>;

/**
 * Check for BigInt values
 */
declare const isBigInt: TypeGuard<bigint>;

/**
 * Extract and validate BigInt values
 */
declare const parseBigInt: TransformFunction<bigint>;

export { getBigInt, isBigInt, parseBigInt };