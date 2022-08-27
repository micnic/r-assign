import type { TransformFunction } from 'r-assign';
import type {
	BaseTypeGuard,
	CompositeTypeGuard,
	InferTuple,
	InferTypeGuard,
	RestTypeGuard,
	Tuple,
	TypeGuard
} from 'r-assign/lib';

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
): CompositeTypeGuard<InferTuple<T>>;

/**
 * Check for tuple rest
 */
declare function isTupleRestOf<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): RestTypeGuard<InferTypeGuard<T>>;

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
	isTupleRestOf,
	isTupleRestOf as tupleRest,
	parseTupleOf
};

export type {
	InferTuple,
	Tuple
};