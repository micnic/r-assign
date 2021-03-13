import type { TransformFunction } from 'r-assign';

export type TypeChecker<T> = (value?: any) => value is T;

export type ExtractTypeGuard<T extends TypeChecker<any>> =
	T extends TypeChecker<infer U> ? U : never;

/**
 * Validate provided types
 */
declare const validateTypes: <T extends TypeChecker<any>>(
	types: T[]
) => void;

/**
 * Creator of transform functions for union types values
 */
declare const getUnionOf: <T extends TypeChecker<any>>(
	types: T[],
	initial: ExtractTypeGuard<T>
) => TransformFunction<ExtractTypeGuard<T>>;

/**
 * Check for values of union types
 */
declare const isUnionOf: <T extends TypeChecker<any>>(
	types: T[],
	value: any
) => value is ExtractTypeGuard<T>;

/**
 * Creator of transform functions for validating union types
 */
declare const parseUnionOf: <T extends TypeChecker<any>>(
	...types: T[]
) => TransformFunction<ExtractTypeGuard<T>>;

export { getUnionOf, isUnionOf, parseUnionOf, validateTypes };