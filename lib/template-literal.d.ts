import type {
	InferTemplateLiteral,
	Literal,
	TemplateLiteral,
	TypeGuard
} from 'r-assign';

/**
 * Check for template literal values
 * @note Does not accept types that cannot be represented as strings
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function isTemplateLiteralOf<
	L extends Literal,
	T extends TemplateLiteral<L>
>(template: T): TypeGuard<InferTemplateLiteral<T>>;

export { isTemplateLiteralOf as templateLiteral };

export type { InferTemplateLiteral, TemplateLiteral };