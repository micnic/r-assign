import type { TransformFunction } from 'r-assign';
import type {
	InferTypeGuard,
	NotOptionalTypeGuard,
	OptionalTypeGuard,
	TypeGuard
} from 'r-assign/lib';

/**
 * Extract optional values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getOptional<T extends TransformFunction>(
	transform: T
): TransformFunction<ReturnType<T> | undefined>;

/**
 * Check for strict optional values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
declare function isOptional<T extends TypeGuard>(
	type: NotOptionalTypeGuard<T>
): OptionalTypeGuard<InferTypeGuard<T>>;

/**
 * Check for optional or undefined values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
declare function isOptionalUndefined<T extends TypeGuard>(
	type: NotOptionalTypeGuard<T>
): OptionalTypeGuard<InferTypeGuard<T> | undefined>;

/**
 * Extract and validate optional values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseOptional<T extends TypeGuard>(
	type: NotOptionalTypeGuard<T>
): TransformFunction<InferTypeGuard<T> | undefined>;

export {
	getOptional,
	isOptional,
	isOptional as optional,
	isOptionalUndefined,
	isOptionalUndefined as optionalUndef,
	parseOptional
};