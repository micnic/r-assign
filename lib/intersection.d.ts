import type { InferIntersection, Intersection, TypeGuard } from 'r-assign';

/**
 * Check for intersection type values
 */
export declare function isIntersectionOf<I extends Intersection>(
	intersection: I
): TypeGuard<InferIntersection<I>>;

export { isIntersectionOf as intersection };

export type { InferIntersection, Intersection };