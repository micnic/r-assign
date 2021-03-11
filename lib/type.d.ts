import type { TransformFunction } from 'r-assign';

/**
 * Creator of transform functions for optional values
 */
declare const useOptional: <T extends TransformFunction>(
	transform: T
) => TransformFunction<ReturnType<T> | undefined>;

export { useOptional };