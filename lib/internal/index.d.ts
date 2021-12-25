import type {
	Intersection,
	Literal,
	Shape,
	TemplateLiteral,
	Tuple,
	TypeGuard,
	Union
} from 'r-assign/lib';

type ArrayTypeGuardMeta = {
	classification: 'array';
	type: TypeGuard;
};

type FunctionTypeGuardMeta = {
	classification: 'function';
	args: TypeGuard;
	result: TypeGuard | undefined;
};

type IntersectionTypeGuardMeta = {
	classification: 'intersection';
	types: Intersection;
};

type LiteralTypeGuardMeta = {
	classification: 'literal';
	literal: Literal;
};

type LiteralsTypeGuardMeta = {
	classification: 'literals';
	literals: Literal[];
};

type NullableTypeGuardMeta = {
	classification: 'nullable';
	type: TypeGuard;
};

type ObjectTypeGuardMeta = {
	classification: 'object';
	shape: Shape;
};

type OptionalTypeGuardMeta = {
	classification: 'optional';
	undef: boolean;
	type: TypeGuard;
};

type PrimitiveTypeGuardMeta = {
	classification: 'primitive';
	type: 'bigint' | 'boolean' | 'number' | 'string' | 'symbol';
};

type TemplateLiteralTypeGuardMeta = {
	classification: 'template-literal';
	template: TemplateLiteral;
};

type TupleTypeGuardMeta = {
	classification: 'tuple';
	types: Tuple;
};

type UnionTypeGuardMeta = {
	classification: 'union';
	types: Union;
};

type TypeGuardMeta = {
	annotation: string;
	description: string;
} & (
	| { classification: 'any' | 'instance' }
	| ArrayTypeGuardMeta
	| FunctionTypeGuardMeta
	| IntersectionTypeGuardMeta
	| LiteralTypeGuardMeta
	| LiteralsTypeGuardMeta
	| NullableTypeGuardMeta
	| ObjectTypeGuardMeta
	| OptionalTypeGuardMeta
	| PrimitiveTypeGuardMeta
	| TemplateLiteralTypeGuardMeta
	| TupleTypeGuardMeta
	| UnionTypeGuardMeta
);

type TypeClassification = TypeGuardMeta['classification'];

export type {
	TypeGuardMeta,
	TypeGuardMeta as TGM,
	TypeClassification,
	TypeClassification as TC
};