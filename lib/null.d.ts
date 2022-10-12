import type { TransformFunction } from 'r-assign';
import type { BaseTypeGuard, InferTypeGuard, TypeGuard } from 'r-assign/lib';

/**
 * Extract null values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getNull(value?: unknown, key?: string, source?: unknown): null;

/**
 * Extract nullable values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getNullable<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): TransformFunction<InferTypeGuard<T> | null>;

/**
 * Check for null values
 */
declare const isNull: TypeGuard<null>;

/**
 * Check for nullable values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
declare function isNullable<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): TypeGuard<InferTypeGuard<T> | null>;

/**
 * Check for nullish values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
declare function isNullish<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): TypeGuard<InferTypeGuard<T> | null | undefined>;

/**
 * Extract and validate null values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseNull(
	value?: unknown,
	key?: string,
	source?: unknown
): null;

/**
 * Extract and validate nullable values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseNullable<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): TransformFunction<InferTypeGuard<T> | null>;

export {
	getNull,
	getNullable,
	isNull,
	isNull as nulled,
	isNullable,
	isNullable as nullable,
	isNullish,
	isNullish as nullish,
	parseNull,
	parseNullable
};