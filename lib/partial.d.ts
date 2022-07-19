import type {
	InferTypeGuard,
	NotOptionalTypeGuard,
	PartialUndefined,
	TypeGuard
} from 'r-assign/lib';

/**
 * Check for values that have all properties strict optional
 * @note Accepts only object, record, array and tuple type guards
 */
declare function isPartial<T extends TypeGuard<Record<keyof any, any> | any[]>>(
	type: NotOptionalTypeGuard<T>
): TypeGuard<Partial<InferTypeGuard<T>>>;

/**
 * Check for values that have all properties optional or undefined
 * @note Accepts only object, record, array and tuple type guards
 */
declare function isPartialUndefined<
	T extends TypeGuard<Record<keyof any, any> | any[]>
>(
	type: NotOptionalTypeGuard<T>
): TypeGuard<PartialUndefined<InferTypeGuard<T>>>;

export {
	isPartial,
	isPartial as partial,
	isPartialUndefined,
	isPartialUndefined as partialUndef
};

export type {
	PartialUndefined
};