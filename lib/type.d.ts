import type { TransformFunction } from 'r-assign';

export type TypeChecker<T> = (value: any) => value is T;

type ExtractTypeGuard<T extends TypeChecker<any>> =
	T extends TypeChecker<infer U> ? U : never;

/**
 * Check for values of union types
 */
declare function isTypeOf<T extends TypeChecker<any>>(
	value: any,
	types: T[]
): value is ExtractTypeGuard<T>;

/**
 * Creator of transform functions for optional values
 */
declare function useOptional<T extends TransformFunction>(
	transform: T
): TransformFunction<ReturnType<T> | undefined>;

/**
 * Creator of transform functions for union types values
 */
declare function useTypeOf<T extends TypeChecker<any>>(
	initial: ExtractTypeGuard<T>,
	types: T[]
): TransformFunction<ExtractTypeGuard<T>>;

/**
 * Creator of transform functions for input validation
 */
declare function useValidation<T extends TypeChecker<any>>(
	...types: T[]
): TransformFunction<ExtractTypeGuard<T>>;

export { isTypeOf, useOptional, useTypeOf, useValidation };
