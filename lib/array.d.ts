import type { BaseTypeGuard, InferType, TypeGuard } from 'r-assign';

/**
 * Check for array values
 */
export declare function isArrayOf<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): TypeGuard<InferType<T>[]>;

export { isArrayOf as array };