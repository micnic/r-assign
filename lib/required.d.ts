import type { BaseTypeGuard, InferTypeGuard, TypeGuard } from 'r-assign';

/**
 * Check for values that have all properties required
 * @note Accepts only object and tuple type guards
 */
export declare function isRequired<
	T extends TypeGuard<Record<keyof any, any> | any[]>
>(type: BaseTypeGuard<T>): TypeGuard<Required<InferTypeGuard<T>>>;

export { isRequired as required };