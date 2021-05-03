import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

export type Instance<T = any> = new (...args: any[]) => T;

export type InferInstance<T extends Instance> = T extends Instance<infer I>
	? I
	: never;

/**
 * Extract instance values
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
 * Extract and validate instance values
 */
declare const parseInstanceOf: <T extends Instance>(
	type: T
) => TransformFunction<InferInstance<T>>;

export { getInstanceOf, isInstanceOf, parseInstanceOf };