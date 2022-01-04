import type { TransformFunction } from 'r-assign';
import type { InferIntersection, Intersection, TypeGuard } from 'r-assign/lib';

/**
 * Extract intersection type values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getIntersectionOf<I extends Intersection>(
	intersection: I,
	initial: InferIntersection<I>
): TransformFunction<InferIntersection<I>>;

/**
 * Check for intersection type values
 * @note Does not accept `isAny` type guard as it is redundant
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
declare function isIntersectionOf<I extends Intersection>(
	intersection: I
): TypeGuard<InferIntersection<I>>;

/**
 * Extract and validate intersection type values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseIntersectionOf<I extends Intersection>(
	intersection: I
): TransformFunction<InferIntersection<I>>;

export {
	getIntersectionOf,
	isIntersectionOf,
	isIntersectionOf as intersection,
	parseIntersectionOf
};

export type {
	InferIntersection,
	Intersection
};