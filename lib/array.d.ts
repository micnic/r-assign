import type { TransformFunction } from 'r-assign';
import type { ExtractTypeGuard, TypeChecker } from 'r-assign/lib/union';

/**
 * Creator of transform functions for array values
 */
declare const getArrayOf: <T extends TypeChecker<any>>(
	types: T[],
	initial?: ExtractTypeGuard<T>
) => TransformFunction<ExtractTypeGuard<T>[]>;

/**
 * Check for array values
 */
declare const isArrayOf: <T extends TypeChecker<any>>(
	types: T[],
	value: any
) => value is ExtractTypeGuard<T>[];

/**
 * Creator of transform functions for array validation
 */
declare const parseArrayOf: <T extends TypeChecker<any>>(
	...types: T[]
) => TransformFunction<ExtractTypeGuard<T>[]>;

export { getArrayOf, isArrayOf, parseArrayOf };