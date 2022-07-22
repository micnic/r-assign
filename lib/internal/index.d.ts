import type {
	Constructor,
	Intersection,
	Literal,
	OptionalTypeGuard,
	Tuple,
	TypeGuard,
	Union
} from 'r-assign/lib';

type ShapeEntries = [string, TypeGuard][];
type StringifiedTemplateLiteral<L extends Literal> = (TypeGuard<L> | string)[];
type ReducibleTemplateLiteral<S extends string> = (TypeGuard<S> | S)[];

type BaseTypeGuardMeta = {
	annotation: string;
	description: string;
};

type AnyTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'any';
};

type ArrayTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'array';
	same: boolean;
	type: TypeGuard;
};

type FunctionTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'function';
	args: TypeGuard<any[] | []>;
	result: TypeGuard | undefined;
};

type InstanceTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'instance';
	constructor: Constructor;
};

type IntersectionTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'intersection';
	types: Intersection
};

type LiteralTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'literal';
	literal: Literal;
};

type LiteralsTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'literals';
	literals: Literal[];
};

type ObjectTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'object';
	entries: ShapeEntries;
	keys: string[];
	mapping?: TypeGuard<Record<keyof any, any>> | undefined;
	same: boolean;
	strict: boolean;
};

type OptionalTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'optional';
	main: OptionalTypeGuard;
	type: TypeGuard;
	undef: boolean;
};

type PrimitiveTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'primitive';
} & (
	| { primitive: 'bigint' | 'boolean' | 'string' | 'symbol' }
	| { primitive: 'number'; finite: boolean }
);

type RecordTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'record';
	keys: TypeGuard<keyof any>;
	same: boolean;
	values: TypeGuard;
};

type TemplateLiteralTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'template-literal';
	regexp: RegExp;
	template: StringifiedTemplateLiteral<any>;
};

type TupleTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'tuple';
	same: boolean;
	tuple: Tuple;
};

type UnionTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'union';
	union: Union;
};

type TypeGuardMeta =
	| AnyTypeGuardMeta
	| ArrayTypeGuardMeta
	| FunctionTypeGuardMeta
	| InstanceTypeGuardMeta
	| IntersectionTypeGuardMeta
	| LiteralTypeGuardMeta
	| LiteralsTypeGuardMeta
	| ObjectTypeGuardMeta
	| OptionalTypeGuardMeta
	| PrimitiveTypeGuardMeta
	| RecordTypeGuardMeta
	| TemplateLiteralTypeGuardMeta
	| TupleTypeGuardMeta
	| UnionTypeGuardMeta;

type TypeClassification = TypeGuardMeta['classification'];

export type {
	ArrayTypeGuardMeta,
	ArrayTypeGuardMeta as ArTGM,
	FunctionTypeGuardMeta,
	FunctionTypeGuardMeta as FTGM,
	LiteralTypeGuardMeta,
	LiteralTypeGuardMeta as LTGM,
	LiteralsTypeGuardMeta,
	LiteralsTypeGuardMeta as LsTGM,
	ObjectTypeGuardMeta,
	ObjectTypeGuardMeta as ObTGM,
	PrimitiveTypeGuardMeta,
	PrimitiveTypeGuardMeta as PTGM,
	RecordTypeGuardMeta,
	RecordTypeGuardMeta as RTGM,
	ReducibleTemplateLiteral,
	ReducibleTemplateLiteral as RTL,
	ShapeEntries,
	ShapeEntries as SE,
	StringifiedTemplateLiteral,
	StringifiedTemplateLiteral as STL,
	TemplateLiteralTypeGuardMeta,
	TemplateLiteralTypeGuardMeta as TLTGM,
	TupleTypeGuardMeta,
	TupleTypeGuardMeta as TTGM,
	TypeGuardMeta,
	TypeGuardMeta as TGM,
	TypeClassification,
	TypeClassification as TC,
	UnionTypeGuardMeta,
	UnionTypeGuardMeta as UTGM
};