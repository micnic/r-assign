import type { TransformFunction } from "r-assign";
import type { TypeGuard } from "r-assign/lib/union";

export type Primitive = bigint | boolean | null | number | symbol | string;

/**
 * Extract literal values
 */
declare const getLiteral: <T extends Primitive>(
	literal: T
) => TransformFunction<T>;

/**
 * Extract union of literal values
 */
declare const getLiteralOf: <T extends Primitive>(
	literals: [T, T, ...T[]],
	initial?: T
) => TransformFunction<T>;

/**
 * Check for literal values
 */
declare const isLiteral: <T extends Primitive>(literal: T) => TypeGuard<T>;

/**
 * Check for union of literal values
 */
declare const isLiteralOf: <T extends Primitive>(
	literals: [T, T, ...T[]]
) => TypeGuard<T>;

/**
 * Extract and validate literal values
 */
declare const parseLiteral: <T extends Primitive>(
	literal: T
) => TransformFunction<T>;

/**
 * Extract and validate union of literal values
 */
declare const parseLiteralOf: <T extends Primitive>(
	literals: [T, T, ...T[]]
) => TransformFunction<T>;

export {
	getLiteral,
	getLiteralOf,
	isLiteral,
	isLiteralOf,
	parseLiteral,
	parseLiteralOf,
};
