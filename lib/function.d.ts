import type {
	BaseTypeGuard,
	InferAsyncFunction,
	InferFunction,
	Tuple,
	TypeGuard
} from 'r-assign';

/**
 * Check for async function values
 */
export declare function isAsyncFunction<
	T extends Tuple,
	R extends TypeGuard = TypeGuard<void>
>(args: T, result?: BaseTypeGuard<R>): TypeGuard<InferAsyncFunction<T, R>>;

/**
 * Check for function values
 */
export declare function isFunction<
	T extends Tuple,
	R extends TypeGuard = TypeGuard<void>
>(args: T, result?: BaseTypeGuard<R>): TypeGuard<InferFunction<T, R>>;

export { isAsyncFunction as asyncFunc, isFunction as func };

export type { InferAsyncFunction, InferFunction };