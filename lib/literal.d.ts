import type { TransformFunction } from 'r-assign';

export type Primitive = bigint | boolean | null | number | symbol | string;

/**
 * Creator of transform functions for literal values
 */
declare const getLiteral: <T extends Primitive>(
	literal: T
) => TransformFunction<T>;

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

export { getLiteral, isLiteral, parseLiteral };