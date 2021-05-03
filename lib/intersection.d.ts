import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

export type Intersection<T = any> = [
	TypeGuard<T>,
	TypeGuard<T>,
	...TypeGuard<T>[]
];

export type InferIntersection<T extends Intersection> = {
	[K in keyof T]: T[K] extends TypeGuard ? (parameter: T[K]) => void : never;
}[number] extends (k: TypeGuard<infer I>) => void
	? I
	: never;

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
