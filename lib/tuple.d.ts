import type { TransformFunction } from 'r-assign';
import type { InferTypeGuard, OptionalTuple, TypeGuard } from 'r-assign/lib';

export type Tuple<T = any> = [TypeGuard<T>, ...TypeGuard<T>[]];

export type InferTuple<T extends Tuple> = OptionalTuple<
	{
		[K in keyof T]: T[K] extends TypeGuard ? InferTypeGuard<T[K]> : never;
	}
>;

/**
 * Extract tuple values
 */
declare const getTupleOf: <T extends Tuple>(
	tuple: T,
	initial: InferTuple<T>
) => TransformFunction<InferTuple<T>>;

/**
 * Check for tuple values
 */
declare const isTupleOf: <T extends Tuple>(
	tuple: T
) => TypeGuard<InferTuple<T>>;

/**
 * Extract and validate tuple values
 */
declare const parseTupleOf: <T extends Tuple>(
	tuple: T
) => TransformFunction<InferTuple<T>>;

export { getTupleOf, isTupleOf, parseTupleOf };