import type {
	BaseTypeGuard,
	InferFunction,
	Tuple,
	TypeGuard
} from 'r-assign/lib';

/**
 * Check for function values
 */
declare function isFunction<
	T extends Tuple,
	R extends TypeGuard = TypeGuard<void>
>(args: T, result?: BaseTypeGuard<R>): TypeGuard<InferFunction<T, R>>;

export {
	isFunction,
	isFunction as func
};

export type { InferFunction };