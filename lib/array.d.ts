import type { BaseTypeGuard, InferType, TypeGuard } from 'r-assign';

/**
 * Check for array values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function isArrayOf<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): TypeGuard<InferType<T>[]>;

export { isArrayOf as array };