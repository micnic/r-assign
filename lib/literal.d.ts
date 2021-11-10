import type { TransformFunction } from 'r-assign';
import type { Literal, TypeGuard } from 'r-assign/lib';

/**
 * Extract literal values
 * @deprecated will be removed in version 2.0, use getType instead
 */
declare function getLiteral<L extends Literal>(
	literal: L
): TransformFunction<L>;

/**
 * Extract union of literal values
 * @deprecated will be removed in version 2.0, use getType instead
 */
declare function getLiteralOf<L extends Literal>(
	literals: [L, L, ...L[]],
	initial?: L
): TransformFunction<L>;

/**
 * Check for literal values
 */
declare function isLiteral<L extends Literal>(literal: L): TypeGuard<L>;

/**
 * Check for union of literal values
 */
declare function isLiteralOf<L extends Literal>(
	literals: [L, L, ...L[]]
): TypeGuard<L>;

/**
 * Extract and validate literal values
 * @deprecated will be removed in version 2.0, use parseType instead
 */
declare function parseLiteral<L extends Literal>(
	literal: L
): TransformFunction<L>;

/**
 * Extract and validate union of literal values
 * @deprecated will be removed in version 2.0, use parseType instead
 */
declare function parseLiteralOf<L extends Literal>(
	literals: [L, L, ...L[]]
): TransformFunction<L>;

export {
	getLiteral,
	getLiteralOf,
	isLiteral,
	isLiteralOf,
	parseLiteral,
	parseLiteralOf,
	Literal
};