import type { BaseTypeGuard, InferTypeGuard, TypeGuard } from 'r-assign';

/**
 * Check for null values
 */
export declare const isNull: TypeGuard<null>;

/**
 * Check for nullable values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function isNullable<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): TypeGuard<InferTypeGuard<T> | null>;

/**
 * Check for nullish values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function isNullish<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): TypeGuard<InferTypeGuard<T> | null | undefined>;

export { isNull as nulled, isNullable as nullable, isNullish as nullish };