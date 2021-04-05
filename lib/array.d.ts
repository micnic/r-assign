import type { TransformFunction } from 'r-assign';
import type { InferTypeGuard, TypeGuard } from 'r-assign/lib/union';

/**
 * Creator of transform functions for array values
 */
declare const getArrayOf: <T extends TypeGuard>(
	type: T,
	initial?: InferTypeGuard<T>[]
) => TransformFunction<InferTypeGuard<T>[]>;

/**
 * Check for array values
 */
declare const isArrayOf: <T extends TypeGuard>(
	type: T
) => TypeGuard<InferTypeGuard<T>[]>;

/**
 * Creator of transform functions for array validation
 */
declare const parseArrayOf: <T extends TypeGuard>(
	type: T
) => TransformFunction<InferTypeGuard<T>[]>;

export { getArrayOf, isArrayOf, parseArrayOf };