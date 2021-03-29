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
 * Creator of transform functions for intersection types values
 */
declare const getIntersectionOf: <I extends Intersection>(
	intersection: I,
	initial: InferIntersection<I>
) => TransformFunction<InferIntersection<I>>;

/**
 * Check for values of intersection types
 */
declare const isIntersectionOf: <I extends Intersection>(
	intersection: I
) => TypeGuard<InferIntersection<I>>;

/**
 * Creator of transform functions for validating intersection types
 */
declare const parseIntersectionOf: <I extends Intersection>(
	intersection: I
) => TransformFunction<InferIntersection<I>>;

export { getIntersectionOf, isIntersectionOf, parseIntersectionOf };
