import type { InferUnion, TypeGuard, Union } from 'r-assign';

/**
 * Check for union type values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function isUnionOf<U extends Union>(
	union: U
): TypeGuard<InferUnion<U>>;

export { isUnionOf as union };

export type { InferUnion, Union };