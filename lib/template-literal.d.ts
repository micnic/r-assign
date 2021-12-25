import type {
	InferTemplateLiteral,
	Literal,
	TemplateLiteral,
	TypeGuard
} from 'r-assign/lib';

/**
 * Check for template literal values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @note Does not accept types that cannot be represented as strings
 */
declare function isTemplateLiteralOf<
	L extends Literal,
	T extends TemplateLiteral<L>
>(template: T): TypeGuard<InferTemplateLiteral<T>>;

export { isTemplateLiteralOf, InferTemplateLiteral, TemplateLiteral };