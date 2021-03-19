import type { TransformFunction } from 'r-assign';

export type TypeGuard<T = any> = (value?: any) => value is T;

export type ExtractTypeGuard<T extends TypeGuard> = T extends TypeGuard<infer U>
	? U
	: never;

export type Union<T = any> = [TypeGuard<T>, TypeGuard<T>, ...TypeGuard<T>[]];

export type ExtractUnion<T extends Union> = T extends Union<infer U>
	? U
	: never;

/**
 * Creator of transform functions for union types values
 */
declare const getUnionOf: <U extends Union>(
	union: U,
	initial: ExtractUnion<U>
) => TransformFunction<ExtractUnion<U>>;

/**
 * Check for values of union types
 */
declare const isUnionOf: <U extends Union>(
	union: U
) => TypeGuard<ExtractUnion<U>>;

/**
 * Creator of transform functions for validating union types
 */
declare const parseUnionOf: <U extends Union>(
	union: U
) => TransformFunction<ExtractUnion<U>>;

export { getUnionOf, isUnionOf, parseUnionOf };