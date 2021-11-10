import type { TransformFunction } from 'r-assign';
import type { InferUnion, TypeGuard, Union } from 'r-assign/lib';

/**
 * Extract union type values
 * @deprecated will be removed in version 2.0, use getType instead
 */
declare function getUnionOf<U extends Union>(
	union: U,
	initial: InferUnion<U>
): TransformFunction<InferUnion<U>>;

/**
 * Check for union type values
 */
declare function isUnionOf<U extends Union>(
	union: U
): TypeGuard<InferUnion<U>>;

/**
 * Extract and validate union type values
 * @deprecated will be removed in version 2.0, use parseType instead
 */
declare function parseUnionOf<U extends Union>(
	union: U
): TransformFunction<InferUnion<U>>;

export { getUnionOf, isUnionOf, parseUnionOf, InferUnion, Union };