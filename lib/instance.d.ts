import type { TransformFunction } from 'r-assign';
import type { Constructor, InferConstructor, TypeGuard } from 'r-assign/lib';

/**
 * Extract instance values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getInstanceOf<C extends Constructor>(
	type: C,
	initial: InferConstructor<C>
): TransformFunction<InferConstructor<C>>;

/**
 * Check for instance values
 */
declare function isInstanceOf<C extends Constructor>(
	type: C
): TypeGuard<InferConstructor<C>>;

/**
 * Extract and validate instance values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseInstanceOf<C extends Constructor>(
	type: C
): TransformFunction<InferConstructor<C>>;

export {
	getInstanceOf,
	isInstanceOf,
	isInstanceOf as instance,
	parseInstanceOf
};

export type {
	Constructor,
	InferConstructor
};