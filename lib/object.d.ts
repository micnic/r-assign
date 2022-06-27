import type { TransformFunction } from 'r-assign';
import type { InferShape, Shape, TypeGuard } from 'r-assign/lib';

/**
 * Extract object values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getObjectOf<S extends Shape>(
	shape: S,
	initial: InferShape<S>
): TransformFunction<InferShape<S>>;

/**
 * Extract strict object values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getStrictObjectOf<S extends Shape>(
	shape: S,
	initial: InferShape<S>
): TransformFunction<InferShape<S>>;

/**
 * Check for object values
 */
declare function isObjectOf<
	S extends Shape,
	M extends TypeGuard<Record<keyof any, any>> | undefined = undefined
>(shape: S, mapping?: M): TypeGuard<InferShape<S, M>>;

/**
 * Check for strict object values
 */
declare function isStrictObjectOf<S extends Shape>(
	shape: S
): TypeGuard<InferShape<S>>;

/**
 * Extract and validate object values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseObjectOf<S extends Shape>(
	shape: S
): TransformFunction<InferShape<S>>;

/**
 * Extract and validate strict object values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseStrictObjectOf<S extends Shape>(
	shape: S
): TransformFunction<InferShape<S>>;

export {
	getObjectOf,
	getStrictObjectOf,
	isObjectOf,
	isObjectOf as object,
	isStrictObjectOf,
	isStrictObjectOf as strictObject,
	parseObjectOf,
	parseStrictObjectOf
};

export type {
	InferShape,
	Shape
};