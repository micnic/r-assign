import type {
	BaseTypeGuard,
	InferAsyncFunction,
	InferFunction,
	Tuple,
	TypeGuard
} from 'r-assign/lib';

/**
 * Check for async function values
 */
declare function isAsyncFunction<
	T extends Tuple,
	R extends TypeGuard = TypeGuard<void>
>(args: T, result?: BaseTypeGuard<R>): TypeGuard<InferAsyncFunction<T, R>>;

/**
 * Check for function values
 */
declare function isFunction<
	T extends Tuple,
	R extends TypeGuard = TypeGuard<void>
>(args: T, result?: BaseTypeGuard<R>): TypeGuard<InferFunction<T, R>>;

export {
	isAsyncFunction,
	isAsyncFunction as asyncFunc,
	isFunction,
	isFunction as func
};

export type { InferAsyncFunction, InferFunction };