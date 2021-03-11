import type { TransformFunction } from 'r-assign';
import type { ExtractTypeGuard, TypeChecker } from 'r-assign/lib/union';

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

/**
 * Creator of transform functions for array values
 */
declare const useArrayOf: <T extends TypeChecker<any>>(
	types: T[],
	initial?: ExtractTypeGuard<T>
) => TransformFunction<ExtractTypeGuard<T>[]>;

export { isArrayOf, parseArrayOf, useArrayOf };