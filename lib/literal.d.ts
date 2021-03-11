import type { TransformFunction } from 'r-assign';

export type Primitive = bigint | boolean | null | number | symbol | string;

/**
 * Check for literal values
 */
declare const isLiteral: <T extends Primitive>(
	literal: T,
	value?: any
) => value is T;

/**
 * Creator of transform functions for literal validation
 */
declare const parseLiteral: <T extends Primitive>(
	literal: T
) => TransformFunction<T>;

/**
 * Creator of transform functions for literal values
 */
declare const useLiteral: <T extends Primitive>(
	literal: T
) => TransformFunction<T>;

export { isLiteral, parseLiteral, useLiteral };