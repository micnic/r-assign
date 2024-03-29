import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Extract BigInt values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getBigInt(initial?: bigint): TransformFunction<bigint>;

/**
 * Check for BigInt values
 */
declare const isBigInt: TypeGuard<bigint>;

/**
 * Extract and validate BigInt values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseBigInt(
	value?: unknown,
	key?: string,
	source?: unknown
): bigint;

export {
	getBigInt,
	isBigInt,
	isBigInt as bigint,
	parseBigInt
};