import type { TransformFunction } from 'r-assign';
import type { ExtractTypeGuard, TypeGuard } from 'r-assign/lib/union';

/**
 * Creator of transform functions for array values
 */
declare const getArrayOf: <T extends TypeGuard>(
	type: T,
	initial?: ExtractTypeGuard<T>[]
) => TransformFunction<ExtractTypeGuard<T>[]>;

/**
 * Check for array values
 */
declare const isArrayOf: <T extends TypeGuard>(
	type: T
) => TypeGuard<ExtractTypeGuard<T>[]>;

/**
 * Creator of transform functions for array validation
 */
declare const parseArrayOf: <T extends TypeGuard>(
	type: T
) => TransformFunction<ExtractTypeGuard<T>[]>;

export { getArrayOf, isArrayOf, parseArrayOf };