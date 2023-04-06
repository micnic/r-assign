import type { InferUnion, TypeGuard, Union } from 'r-assign';

/**
 * Check for union type values
 */
export declare function isUnionOf<U extends Union>(
	union: U
): TypeGuard<InferUnion<U>>;

export { isUnionOf as union };

export type { InferUnion, Union };