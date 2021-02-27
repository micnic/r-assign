import type { TransformFunction } from 'r-assign';
import type { ExtractTypeGuard, TypeChecker } from 'r-assign/lib/type';

/**
 * Check for array values
 */
const isArrayOf: <T extends TypeChecker<any>>(
	types: T[],
	value: any
) => value is ExtractTypeGuard<T>[];

/**
 * Creator of transform functions for array values
 */
const useArrayOf: <T extends TypeChecker<any>>(
	types: T[],
	initial?: ExtractTypeGuard<T>
) => TransformFunction<ExtractTypeGuard<T>[]>;

/**
 * Creator of transform functions for input validation
 */
const useArrayOfValidation: <T extends TypeChecker<any>>(
	...types: T[]
) => TransformFunction<ExtractTypeGuard<T>[]>;

export {
	isArrayOf,
	useArrayOf,
	useArrayOfValidation
};