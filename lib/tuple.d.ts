import type {
	BaseTypeGuard,
	InferTuple,
	InferTypeGuard,
	RestTypeGuard,
	Tuple,
	TypeGuard
} from 'r-assign';

/**
 * Check for tuple values
 */
export declare function isTupleOf<T extends Tuple>(
	tuple: T
): TypeGuard<InferTuple<T>>;

/**
 * Check for tuple rest
 */
export declare function isTupleRestOf<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): RestTypeGuard<InferTypeGuard<T>>;

export { isTupleOf as tuple, isTupleRestOf as tupleRest };

export type { InferTuple, Tuple };