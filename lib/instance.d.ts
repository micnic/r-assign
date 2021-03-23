import type { TransformFunction } from 'r-assign';
import type { ExtractTypeGuard, TypeGuard } from 'r-assign/lib/union';

export type Instance<T = any> = new (...args: any[]) => T;

export type ExtractInstance<T extends Instance> = T extends Instance<infer I>
	? I
	: never;

/**
 * Creator of transform functions for instance values
 */
declare const getInstanceOf: <T extends Instance>(
	type: T,
	initial: ExtractInstance<T>
) => TransformFunction<ExtractInstance<T>>;

/**
 * Check for instance values
 */
declare const isInstanceOf: <T extends Instance>(
	type: T
) => TypeGuard<ExtractInstance<T>>;

/**
 * Creator of transform functions for instance validation
 */
declare const parseInstanceOf: <T extends Instance>(
	types: T
) => TransformFunction<ExtractInstance<T>>;

export { getInstanceOf, isInstanceOf, parseInstanceOf };