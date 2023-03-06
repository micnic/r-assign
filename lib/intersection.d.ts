import type { InferIntersection, Intersection, TypeGuard } from 'r-assign';

/**
 * Check for intersection type values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function isIntersectionOf<I extends Intersection>(
	intersection: I
): TypeGuard<InferIntersection<I>>;

export { isIntersectionOf as intersection };

export type { InferIntersection, Intersection };