import type { TransformFunction } from 'r-assign';
import type { ExtractTypeGuard, TypeChecker } from 'r-assign/lib/union';

export type Shape = {
	[key: string]: TypeChecker<any>;
};

/**
 * Check for object values
 */
declare const isObjectOf: <S extends Shape>(
	shape: S,
	value: any
) => value is { [key in keyof S]: ExtractTypeGuard<S[key]> };

/**
 * Creator of transform functions for object validation
 */
declare const parseObjectOf: <S extends Shape>(
	shape: S
) => TransformFunction<{ [key in keyof S]: ExtractTypeGuard<S[key]> }>;

/**
 * Creator of transform functions for object values
 */
declare const useObjectOf: <S extends Shape>(
	shape: S,
	initial: { [key in keyof S]: ExtractTypeGuard<S[key]> }
) => TransformFunction<{ [key in keyof S]: ExtractTypeGuard<S[key]> }>;

export { isObjectOf, parseObjectOf, useObjectOf };