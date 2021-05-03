import type { TransformFunction } from 'r-assign';
import type { InferTypeGuard, TypeGuard } from 'r-assign/lib';

/**
 * Extract optional values
 */
declare const getOptional: <T extends TransformFunction>(
	transform: T
) => TransformFunction<ReturnType<T> | undefined>;

/**
 * Check for optional values
 */
declare const isOptional: <T extends TypeGuard>(
	type: T
) => TypeGuard<InferTypeGuard<T> | undefined>;

/**
 * Extract and validate optional values
 */
declare const parseOptional: <T extends TypeGuard>(
	type: T
) => TransformFunction<InferTypeGuard<T> | undefined>;

export { getOptional, isOptional, parseOptional };