import type { TransformFunction } from 'r-assign';
import type { InferTypeGuard, OptionalObject, TypeGuard } from 'r-assign/lib';

export type Shape = {
	[key: string]: TypeGuard;
};

export type ResultObject<S extends Shape> = OptionalObject<
	{ [key in keyof S]: InferTypeGuard<S[key]> }
>;

/**
 * Extract object values
 */
declare const getObjectOf: <S extends Shape>(
	shape: S,
	initial: ResultObject<S>
) => TransformFunction<ResultObject<S>>;

/**
 * Extract strict object values
 */
declare const getStrictObjectOf: <S extends Shape>(
	shape: S,
	initial: ResultObject<S>
) => TransformFunction<ResultObject<S>>;

/**
 * Check for object values
 */
declare const isObjectOf: <S extends Shape>(
	shape: S
) => TypeGuard<ResultObject<S>>;

/**
 * Check for strict object values
 */
declare const isStrictObjectOf: <S extends Shape>(
	shape: S
) => TypeGuard<ResultObject<S>>;

/**
 * Extract and validate object values
 */
declare const parseObjectOf: <S extends Shape>(
	shape: S
) => TransformFunction<ResultObject<S>>;

/**
 * Extract and validate strict object values
 */
declare const parseStrictObjectOf: <S extends Shape>(
	shape: S
) => TransformFunction<ResultObject<S>>;

export {
	getObjectOf,
	getStrictObjectOf,
	isObjectOf,
	isStrictObjectOf,
	parseObjectOf,
	parseStrictObjectOf
};