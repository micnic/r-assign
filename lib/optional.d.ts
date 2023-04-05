import type {
	BaseTypeGuard,
	InferType,
	OptionalTypeGuard,
	OptionalDefaultTypeGuard,
	TypeGuard
} from 'r-assign';

/**
 * Check for strict optional values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function isOptional<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): OptionalTypeGuard<InferType<T>>;

/**
 * Check for strict optional values with default value
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function isOptional<T extends TypeGuard>(
	type: BaseTypeGuard<T>,
	def?: InferType<T> | (() => InferType<T>)
): OptionalDefaultTypeGuard<InferType<T>>;

/**
 * Check for optional or undefined values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function isOptionalUndefined<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): OptionalTypeGuard<InferType<T> | undefined>;

/**
 * Check for optional or undefined values with default value
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function isOptionalUndefined<T extends TypeGuard>(
	type: BaseTypeGuard<T>,
	def?: InferType<T> | (() => InferType<T>)
): OptionalDefaultTypeGuard<InferType<T> | undefined>;

export {
	isOptional as optional,
	isOptionalUndefined as optionalUndef
};