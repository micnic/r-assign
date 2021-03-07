import type { TransformFunction } from 'r-assign';

/**
 * Creator of transform functions for optional values
 */
const useOptional: <T extends TransformFunction>(
	transform: T
) => TransformFunction<ReturnType<T> | undefined>;

export { useOptional };
