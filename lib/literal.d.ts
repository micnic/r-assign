import type { TransformFunction } from "r-assign";

export type Primitive = bigint | boolean | null | number | symbol | string;

/**
 * Check for literal values
 */
const isLiteral: <T extends Primitive>(literal: T, value?: any) => value is T;

/**
 * Check for value of union of literals
 */
const isLiteralOf: <T extends Primitive>(
	literals: T[],
	value?: any
) => value is T;

/**
 * Creator of transform functions for literal values
 */
const useLiteral: <T extends Primitive>(literal: T) => TransformFunction<T>;

/**
 * Creator of transform functions for values of union of literals
 */
const useLiteralOf: <T extends Primitive, I extends T>(
	literals: T[],
	initial: I
) => TransformFunction<T>;

/**
 * Creator of transform functions for values of union of literals validation
 */
const useLiteralOfValidation: <T extends Primitive>(
	literals: T[]
) => TransformFunction<ExtractTypeGuard<T>>;

/**
 * Creator of transform functions for literal validation
 */
const useLiteralValidation: <T extends Primitive>(
	literal: T
) => TransformFunction<ExtractTypeGuard<T>>;

export {
	isLiteral,
	isLiteralOf,
	useLiteral,
	useLiteralOf,
	useLiteralOfValidation,
	useLiteralValidation
};
