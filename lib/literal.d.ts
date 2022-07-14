import type { TransformFunction } from 'r-assign';
import type { InferLiterals, Literal, Literals, TypeGuard } from 'r-assign/lib';

/**
 * Extract literal values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getLiteral<L extends Literal>(
	literal: L
): TransformFunction<L>;

/**
 * Extract union of literal values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getLiteralOf<L extends Literal, T extends Literals<L>>(
	literals: T,
	initial: InferLiterals<L, T>
): TransformFunction<InferLiterals<L, T>>;

/**
 * Check for literal values
 */
declare function isLiteral<L extends Literal>(literal: L): TypeGuard<L>;

/**
 * Check for union of literal values
 */
declare function isLiteralOf<L extends Literal, T extends Literals<L>>(
	literals: T
): TypeGuard<InferLiterals<L, T>>;

/**
 * Extract and validate literal values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseLiteral<L extends Literal>(
	literal: L
): TransformFunction<L>;

/**
 * Extract and validate union of literal values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseLiteralOf<L extends Literal, T extends Literals<L>>(
	literals: T
): TransformFunction<InferLiterals<L, T>>;

export {
	getLiteral,
	getLiteralOf,
	isLiteral,
	isLiteral as literal,
	isLiteralOf,
	isLiteralOf as literals,
	parseLiteral,
	parseLiteralOf
};

export type { Literal };