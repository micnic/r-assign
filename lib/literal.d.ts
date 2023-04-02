import type { InferLiterals, Literal, Literals, TypeGuard } from 'r-assign';

/**
 * Check for literal values
 */
export declare function isLiteral<L extends Literal = undefined>(
	literal?: L
): TypeGuard<L>;

/**
 * Check for union of literal values
 */
export declare function isLiteralOf<L extends Literal, T extends Literals<L>>(
	literals: T
): TypeGuard<InferLiterals<L, T>>;

export { isLiteral as literal, isLiteralOf as literals };

export type { Literal };