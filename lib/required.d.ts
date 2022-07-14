import type {
	InferTypeGuard,
	NotOptionalTypeGuard,
	TypeGuard
} from 'r-assign/lib';

/**
 * Check for values that have all properties required
 * @note Accepts only object and tuple type guards
 */
declare function isRequired<
	T extends TypeGuard<Record<keyof any, any> | any[]>
>(type: NotOptionalTypeGuard<T>): TypeGuard<Required<InferTypeGuard<T>>>;

export {
	isRequired,
	isRequired as required
};