import type { TransformFunction } from 'r-assign';
import type { ExtractTypeGuard, TypeGuard } from 'r-assign/lib/union';

export type Shape = {
	[key: string]: TypeGuard;
};

/**
 * Creator of transform functions for object values
 */
declare const getObjectOf: <S extends Shape>(
	shape: S,
	initial: { [key in keyof S]: ExtractTypeGuard<S[key]> }
) => TransformFunction<{ [key in keyof S]: ExtractTypeGuard<S[key]> }>;

/**
 * Check for object values
 */
declare const isObjectOf: <S extends Shape>(
	shape: S
) => TypeGuard<{ [key in keyof S]: ExtractTypeGuard<S[key]> }>;

/**
 * Creator of transform functions for object validation
 */
declare const parseObjectOf: <S extends Shape>(
	shape: S
) => TransformFunction<{ [key in keyof S]: ExtractTypeGuard<S[key]> }>;

export { getObjectOf, isObjectOf, parseObjectOf };