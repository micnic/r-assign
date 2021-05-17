import type { TransformFunction } from 'r-assign';
import type { InferTypeGuard, TypeGuard } from 'r-assign/lib';

/**
 * Extract null values
 */
 declare const getNull: () => TransformFunction<null>;

/**
 * Extract nullable values
 */
declare const getNullable: <T extends TransformFunction>(
	transform: T
) => TransformFunction<ReturnType<T> | null>;

/**
 * Check for null values
 */
declare const isNull: TypeGuard<null>;

/**
 * Check for nullable values
 */
declare const isNullable: <T extends TypeGuard>(
	type: T
) => TypeGuard<InferTypeGuard<T> | null>;

/**
 * Extract and validate null values
 */
declare const parseNull: TransformFunction<null>;

/**
 * Extract and validate nullable values
 */
declare const parseNullable: <T extends TypeGuard>(
	type: T
) => TransformFunction<InferTypeGuard<T> | null>;

export { getNull, getNullable, isNull, isNullable, parseNull, parseNullable };