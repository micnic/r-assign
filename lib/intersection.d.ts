import type { TransformFunction } from "r-assign";
import type { TypeGuard, Union } from "r-assign/lib/union";

export type Intersection<T = any> = Union<T>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

export type InferIntersection<
	T extends Intersection
> = T extends Intersection<infer U> ? UnionToIntersection<U> : never;

/**
 * Extract intersection type values
 */
declare const getIntersectionOf: <I extends Intersection>(
	intersection: I,
	initial: InferIntersection<I>
) => TransformFunction<InferIntersection<I>>;

/**
 * Check for intersection type values
 */
declare const isIntersectionOf: <I extends Intersection>(
	intersection: I
) => TypeGuard<InferIntersection<I>>;

/**
 * Extract and validate intersection type values
 */
declare const parseIntersectionOf: <I extends Intersection>(
	intersection: I
) => TransformFunction<InferIntersection<I>>;

export { getIntersectionOf, isIntersectionOf, parseIntersectionOf };
