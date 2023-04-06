import type { BaseTypeGuard, InferType, TypeGuard } from 'r-assign';

/**
 * Asserts that the provided value is of the provided type
 */
export declare function assertType<T extends TypeGuard>(
	type: BaseTypeGuard<T>,
	value: unknown,
	message?: string
): asserts value is InferType<T>;