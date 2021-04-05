import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib/union';

export type Instance<T = any> = new (...args: any[]) => T;

export type InferInstance<T extends Instance> = T extends Instance<infer I>
	? I
	: never;

/**
 * Creator of transform functions for instance values
 */
declare const getInstanceOf: <T extends Instance>(
	type: T,
	initial: InferInstance<T>
) => TransformFunction<InferInstance<T>>;

/**
 * Check for instance values
 */
declare const isInstanceOf: <T extends Instance>(
	type: T
) => TypeGuard<InferInstance<T>>;

/**
 * Creator of transform functions for instance validation
 */
declare const parseInstanceOf: <T extends Instance>(
	type: T
) => TransformFunction<InferInstance<T>>;

export { getInstanceOf, isInstanceOf, parseInstanceOf };