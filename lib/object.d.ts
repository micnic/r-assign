import type { TransformFunction } from 'r-assign';
import type { InferTypeGuard, TypeGuard } from 'r-assign/lib/union';

export type Shape = {
	[key: string]: TypeGuard;
};

/**
 * Creator of transform functions for object values
 */
declare const getObjectOf: <S extends Shape>(
	shape: S,
	initial: { [key in keyof S]: InferTypeGuard<S[key]> }
) => TransformFunction<{ [key in keyof S]: InferTypeGuard<S[key]> }>;

/**
 * Creator of transform functions for strict object values
 */
declare const getStrictObjectOf: <S extends Shape>(
	shape: S,
	initial: { [key in keyof S]: InferTypeGuard<S[key]> }
) => TransformFunction<{ [key in keyof S]: InferTypeGuard<S[key]> }>;

/**
 * Check for object values
 */
declare const isObjectOf: <S extends Shape>(
	shape: S
) => TypeGuard<{ [key in keyof S]: InferTypeGuard<S[key]> }>;

/**
 * Check for strict object values
 */
declare const isStrictObjectOf: <S extends Shape>(
	shape: S
) => TypeGuard<{ [key in keyof S]: InferTypeGuard<S[key]> }>;

/**
 * Creator of transform functions for object validation
 */
declare const parseObjectOf: <S extends Shape>(
	shape: S
) => TransformFunction<{ [key in keyof S]: InferTypeGuard<S[key]> }>;

/**
 * Creator of transform functions for strict object validation
 */
declare const parseStrictObjectOf: <S extends Shape>(
	shape: S
) => TransformFunction<{ [key in keyof S]: InferTypeGuard<S[key]> }>;

export {
	getObjectOf,
	getStrictObjectOf,
	isObjectOf,
	isStrictObjectOf,
	parseObjectOf,
	parseStrictObjectOf
};