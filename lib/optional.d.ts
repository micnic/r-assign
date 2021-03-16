import type { TransformFunction } from 'r-assign';
import type { ExtractTypeGuard, TypeGuard } from 'r-assign/lib/union';

/**
 * Creator of transform functions for optional values
 */
declare const getOptional: <T extends TransformFunction>(
	transform: T
) => TransformFunction<ReturnType<T> | undefined>;

/**
 * Check for optional values
 */
declare const isOptional: <T extends TypeGuard>(
	type: T
) => TypeGuard<ExtractTypeGuard<T> | undefined>;

/**
 * Creator of transform functions for array validation
 */
declare const parseOptional: <T extends TypeGuard>(
	types: T
) => TransformFunction<ExtractTypeGuard<T> | undefined>;

export { getOptional, isOptional, parseOptional };