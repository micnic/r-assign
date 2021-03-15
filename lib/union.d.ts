import type { TransformFunction } from 'r-assign';

export type TypeGuard<T = any> = (value?: any) => value is T;

export type ExtractTypeGuard<T extends TypeGuard> = T extends TypeGuard<infer U>
	? U
	: never;

/**
 * Validate provided types
 */
declare const validateTypes: <T extends TypeGuard>(types: T[]) => void;

/**
 * Creator of transform functions for union types values
 */
declare const getUnionOf: <T extends TypeGuard>(
	types: T[],
	initial: ExtractTypeGuard<T>
) => TransformFunction<ExtractTypeGuard<T>>;

/**
 * Check for values of union types
 */
declare const isUnionOf: <T extends TypeGuard>(
	...types: T[]
) => TypeGuard<ExtractTypeGuard<T>>;

/**
 * Creator of transform functions for validating union types
 */
declare const parseUnionOf: <T extends TypeGuard>(
	...types: T[]
) => TransformFunction<ExtractTypeGuard<T>>;

export { getUnionOf, isUnionOf, parseUnionOf, validateTypes };