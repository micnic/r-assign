import type { TransformFunction } from "r-assign";

export type Primitive = bigint | boolean | null | number | symbol | string;

/**
 * Check for literal values
 */
const isLiteral: <T extends Primitive>(literal: T, value?: any) => value is T;

/**
 * Creator of transform functions for literal validation
 */
const parseLiteral: <T extends Primitive>(
	literal: T
) => TransformFunction<ExtractTypeGuard<T>>;

/**
 * Creator of transform functions for literal values
 */
const useLiteral: <T extends Primitive>(literal: T) => TransformFunction<T>;

export {
	isLiteral,
	parseLiteral,
	useLiteral
};
