import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

export type Union<T = any> = [TypeGuard<T>, TypeGuard<T>, ...TypeGuard<T>[]];

export type InferUnion<T extends Union> = T extends Union<infer U>
	? U
	: never;

/**
 * Extract union type values
 */
declare const getUnionOf: <U extends Union>(
	union: U,
	initial: InferUnion<U>
) => TransformFunction<InferUnion<U>>;

/**
 * Check for union type values
 */
declare const isUnionOf: <U extends Union>(
	union: U
) => TypeGuard<InferUnion<U>>;

/**
 * Extract and validate union type values
 */
declare const parseUnionOf: <U extends Union>(
	union: U
) => TransformFunction<InferUnion<U>>;

export { getUnionOf, isUnionOf, parseUnionOf };