import type { Constructor, InferConstructor, TypeGuard } from 'r-assign';

/**
 * Check for instance values
 */
export declare function isInstanceOf<C extends Constructor>(
	type: C
): TypeGuard<InferConstructor<C>>;

export { isInstanceOf as instance };

export type { Constructor, InferConstructor };