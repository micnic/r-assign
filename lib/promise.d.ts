import type { BaseTypeGuard, InferType, TypeGuard } from 'r-assign';

/**
 * Check for promise values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function isPromiseOf<T extends TypeGuard = TypeGuard<void>>(
	type?: BaseTypeGuard<T>
): TypeGuard<Promise<InferType<T>>>;

export { isPromiseOf as promise };