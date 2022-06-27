import type { TransformFunction } from 'r-assign';
import type { InferTuple, Tuple, TypeGuard } from 'r-assign/lib';

/**
 * Extract tuple values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getTupleOf<T extends Tuple>(
	tuple: T,
	initial: InferTuple<T>
): TransformFunction<InferTuple<T>>;

/**
 * Check for tuple values
 */
declare function isTupleOf<T extends Tuple>(
	tuple: T
): TypeGuard<InferTuple<T>>;

/**
 * Extract and validate tuple values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseTupleOf<T extends Tuple>(
	tuple: T
): TransformFunction<InferTuple<T>>;

export {
	getTupleOf,
	isTupleOf,
	isTupleOf as tuple,
	parseTupleOf
};

export type {
	InferTuple,
	Tuple
};