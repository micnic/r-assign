import type { TransformFunction } from 'r-assign';
import type { InferTypeGuard, TypeGuard } from 'r-assign/lib';

export type Shape = {
	[key: string]: TypeGuard;
};

/**
 * Extract object values
 */
declare const getObjectOf: <S extends Shape>(
	shape: S,
	initial: { [key in keyof S]: InferTypeGuard<S[key]> }
) => TransformFunction<{ [key in keyof S]: InferTypeGuard<S[key]> }>;

/**
 * Extract strict object values
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
 * Extract and validate object values
 */
declare const parseObjectOf: <S extends Shape>(
	shape: S
) => TransformFunction<{ [key in keyof S]: InferTypeGuard<S[key]> }>;

/**
 * Extract and validate strict object values
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