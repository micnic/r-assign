import type {
	InferIntersection,
	InferType,
	Intersection,
	TypeGuard
} from 'r-assign';

/**
 * Check for intersection type values
 */
export declare function isIntersectionOf<I extends []>(
	intersection: I
): TypeGuard<never>;

/**
 * Check for intersection type values
 */
export declare function isIntersectionOf<I extends [TypeGuard]>(
	intersection: I
): TypeGuard<InferType<I[0]>>;

/**
 * Check for intersection type values
 */
export declare function isIntersectionOf<I extends Intersection>(
	intersection: I
): TypeGuard<InferIntersection<I>>;

export { isIntersectionOf as intersection };

export type { InferIntersection, Intersection };