import type { TransformFunction } from "r-assign";

export type Primitive = bigint | boolean | number | symbol | string;

/**
 * Check for literal values
 */
const isLiteral: <T extends Primitive>(literal: T, value?: any) => value is T;

/**
 * Creator of transform functions for literal values
 */
const useLiteral: <T extends Primitive>(
	literal: T
) => TransformFunction<T>;

/**
 * Creator of transform functions for literal validation
 */
const useLiteralValidation: <T extends Primitive>(
	literal: T
) => TransformFunction<ExtractTypeGuard<T>>;

export { isLiteral, useLiteral, useLiteralValidation };
