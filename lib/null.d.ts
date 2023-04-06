import type { BaseTypeGuard, InferType, TypeGuard } from 'r-assign';

/**
 * Check for null values
 */
export declare const isNull: TypeGuard<null>;

/**
 * Check for nullable values
 */
export declare function isNullable<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): TypeGuard<InferType<T> | null>;

/**
 * Check for nullish values
 */
export declare function isNullish<T extends TypeGuard>(
	type: BaseTypeGuard<T>
): TypeGuard<InferType<T> | null | undefined>;

export { isNull as nulled, isNullable as nullable, isNullish as nullish };