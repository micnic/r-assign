import type {
	BaseTypeGuard,
	InferTypeGuard,
	PartialUndefined,
	TypeGuard
} from 'r-assign';

/**
 * Check for values that have all properties strict optional
 * @note Accepts only object, record, array and tuple type guards
 */
export declare function isPartial<
	T extends TypeGuard<Record<keyof any, any> | any[]>
>(type: BaseTypeGuard<T>): TypeGuard<Partial<InferTypeGuard<T>>>;

/**
 * Check for values that have all properties optional or undefined
 * @note Accepts only object, record, array and tuple type guards
 */
export declare function isPartialUndefined<
	T extends TypeGuard<Record<keyof any, any> | any[]>
>(
	type: BaseTypeGuard<T>
): TypeGuard<PartialUndefined<InferTypeGuard<T>>>;

export { isPartial as partial, isPartialUndefined as partialUndef };

export type { PartialUndefined };