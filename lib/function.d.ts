import type {
	BaseTypeGuard,
	InferFunction,
	Tuple,
	TypeGuard
} from 'r-assign/lib';

/**
 * Check for function values
 */
declare function isFunction<T extends Tuple, R extends TypeGuard>(
	args: T,
	result: BaseTypeGuard<R>
): TypeGuard<InferFunction<T, R>>;

/**
 * Check for function values
 */
declare function isFunction<T extends Tuple>(
	args: T
): TypeGuard<InferFunction<T, TypeGuard<void>>>;

export {
	isFunction,
	isFunction as func
};

export type { InferFunction };