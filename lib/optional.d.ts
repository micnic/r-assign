import type {
	BaseTypeGuard,
	InferTypeGuard,
	OptionalTypeGuard,
	TypeGuard
} from 'r-assign/lib';

/**
 * Check for strict optional values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
declare function isOptional<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): OptionalTypeGuard<InferTypeGuard<T>>;

/**
 * Check for optional or undefined values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
declare function isOptionalUndefined<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): OptionalTypeGuard<InferTypeGuard<T> | undefined>;

export {
	isOptional,
	isOptional as optional,
	isOptionalUndefined,
	isOptionalUndefined as optionalUndef
};