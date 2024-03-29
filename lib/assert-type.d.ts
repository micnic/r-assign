import type { BaseTypeGuard, InferTypeGuard, TypeGuard } from 'r-assign/lib';

/**
 * Asserts that the provided value is of the provided type
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
declare function assertType<T extends TypeGuard>(
	type: BaseTypeGuard<T>,
	value: unknown,
	message?: string
): asserts value is InferTypeGuard<T>;

export { assertType };