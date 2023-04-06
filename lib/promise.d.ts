import type { BaseTypeGuard, InferType, TypeGuard } from 'r-assign';

/**
 * Check for promise values
 */
export declare function isPromiseOf<T extends TypeGuard = TypeGuard<void>>(
	type?: BaseTypeGuard<T>
): TypeGuard<Promise<InferType<T>>>;

export { isPromiseOf as promise };