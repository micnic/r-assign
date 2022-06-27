import type { TransformFunction } from 'r-assign';
import type {
	InferTypeGuard,
	NotOptionalTypeGuard,
	TypeGuard
} from 'r-assign/lib';

/**
 * Extract array values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getArrayOf<T extends TypeGuard>(
	type: NotOptionalTypeGuard<T>,
	initial?: InferTypeGuard<NotOptionalTypeGuard<T>>[]
): TransformFunction<InferTypeGuard<T>[]>;

/**
 * Check for array values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
declare function isArrayOf<T extends TypeGuard>(
	type: NotOptionalTypeGuard<T>
): TypeGuard<InferTypeGuard<T>[]>;

/**
 * Extract and validate array values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseArrayOf<T extends TypeGuard>(
	type: NotOptionalTypeGuard<T>
): TransformFunction<InferTypeGuard<T>[]>;

export {
	getArrayOf,
	isArrayOf,
	isArrayOf as array,
	parseArrayOf
};