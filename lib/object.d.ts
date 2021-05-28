import type { TransformFunction } from 'r-assign';
import type { InferTypeGuard, OptionalObject, TypeGuard } from 'r-assign/lib';

export type Shape = {
	[key: string]: TypeGuard;
};

export type InferShape<S extends Shape> = OptionalObject<
	{ [key in keyof S]: InferTypeGuard<S[key]> }
>;

/**
 * Extract object values
 */
declare const getObjectOf: <S extends Shape>(
	shape: S,
	initial: InferShape<S>
) => TransformFunction<InferShape<S>>;

/**
 * Extract strict object values
 */
declare const getStrictObjectOf: <S extends Shape>(
	shape: S,
	initial: InferShape<S>
) => TransformFunction<InferShape<S>>;

/**
 * Check for object values
 */
declare const isObjectOf: <S extends Shape>(
	shape: S
) => TypeGuard<InferShape<S>>;

/**
 * Check for strict object values
 */
declare const isStrictObjectOf: <S extends Shape>(
	shape: S
) => TypeGuard<InferShape<S>>;

/**
 * Extract and validate object values
 */
declare const parseObjectOf: <S extends Shape>(
	shape: S
) => TransformFunction<InferShape<S>>;

/**
 * Extract and validate strict object values
 */
declare const parseStrictObjectOf: <S extends Shape>(
	shape: S
) => TransformFunction<InferShape<S>>;

export {
	getObjectOf,
	getStrictObjectOf,
	isObjectOf,
	isStrictObjectOf,
	parseObjectOf,
	parseStrictObjectOf
};