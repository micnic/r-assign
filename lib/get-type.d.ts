import type { TransformFunction } from 'r-assign';
import type { InferTypeGuard, TypeGuard } from 'r-assign/lib';

/**
 * Extract values based on provided type guard and default value
 */
declare function getType<T extends TypeGuard>(
	type: T,
	initial: InferTypeGuard<T>
): TransformFunction<InferTypeGuard<T>>;

export { getType };