import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib/union';

/**
 * Creator of transform functions for bigint values
 */
declare const getBigInt: (initial?: bigint) => TransformFunction<bigint>;

/**
 * Check for bigint values
 */
declare const isBigInt: TypeGuard<bigint>;

/**
 * Transform function to validate bigint values
 */
declare const parseBigInt: TransformFunction<bigint>;

export { getBigInt, isBigInt, parseBigInt };