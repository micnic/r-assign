import type {
	Constructor,
	Intersection,
	Literal,
	OptionalTypeGuard,
	Tuple,
	TypeGuard,
	Union
} from 'r-assign';

type ShapeEntries = [string, TypeGuard][];
type StringifiedTemplateLiteral<L extends Literal> = (TypeGuard<L> | string)[];
type ReducibleTemplateLiteral<S extends string> = (TypeGuard<S> | S)[];

type AnyTypeGuardMeta = {
	classification: 'any';
};

type ArrayTypeGuardMeta = {
	child: TypeGuardMeta;
	classification: 'array';
	same: boolean;
	type: TypeGuard;
};

type FunctionTypeGuardMeta = {
	children: [TypeGuardMeta, TypeGuardMeta];
	classification: 'function';
	types: [TypeGuard<any[] | []>, TypeGuard | undefined];
};

type InstanceTypeGuardMeta = {
	builder: Constructor;
	classification: 'instance';
};

type IntersectionTypeGuardMeta = {
	children: TypeGuardMeta[];
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

type NeverTypeGuardMeta = {
	classification: 'never';
};

type ObjectTypeGuardMeta = {
	classification: 'object';
	keys: string[];
	mapping?: TypeGuard<Record<keyof any, any>> | undefined;
	optional: ShapeEntries;
	required: ShapeEntries;
	same: boolean;
	strict: boolean;
};

type OptionalTypeGuardMeta = {
	child: TypeGuardMeta;
	classification: 'optional';
	main: OptionalTypeGuard;
	type: TypeGuard;
	undef: boolean;
};

type PrimitiveTypeGuardMeta = {
	classification: 'primitive';
} & (
	| { primitive: 'bigint' | 'boolean' | 'string' | 'symbol' }
	| { primitive: 'number'; finite: boolean }
);

type PromiseTypeGuardMeta = {
	child: TypeGuardMeta;
	classification: 'promise';
	type: TypeGuard | undefined;
};

type RecordTypeGuardMeta = {
	classification: 'record';
	keys: TypeGuard<keyof any>;
	same: boolean;
	values: TypeGuard;
};

type RestTypeGuardMeta = {
	child: TypeGuardMeta;
	classification: 'rest';
	type: TypeGuard;
};

type TemplateLiteralTypeGuardMeta = {
	classification: 'template-literal';
	regexp: RegExp;
	template: StringifiedTemplateLiteral<any>;
};

type TupleTypeGuardMeta = {
	classification: 'tuple';
	indexes: {
		optional: number;
		required: number;
		rest: number;
	};
	same: boolean;
	tuple: Tuple;
};

type UnionTypeGuardMeta = {
	children: TypeGuardMeta[];
	classification: 'union';
	union: Union;
};

type VoidTypeGuardMeta = {
	classification: 'void';
};

type TypeGuardMeta =
	| AnyTypeGuardMeta
	| ArrayTypeGuardMeta
	| FunctionTypeGuardMeta
	| InstanceTypeGuardMeta
	| IntersectionTypeGuardMeta
	| LiteralTypeGuardMeta
	| LiteralsTypeGuardMeta
	| NeverTypeGuardMeta
	| ObjectTypeGuardMeta
	| OptionalTypeGuardMeta
	| PrimitiveTypeGuardMeta
	| PromiseTypeGuardMeta
	| RecordTypeGuardMeta
	| RestTypeGuardMeta
	| TemplateLiteralTypeGuardMeta
	| TupleTypeGuardMeta
	| UnionTypeGuardMeta
	| VoidTypeGuardMeta;

type TypeClassification = TypeGuardMeta['classification'];

export type {
	ArrayTypeGuardMeta,
	ArrayTypeGuardMeta as ATGM,
	FunctionTypeGuardMeta,
	FunctionTypeGuardMeta as FTGM,
	LiteralTypeGuardMeta,
	LiteralTypeGuardMeta as LTGM,
	LiteralsTypeGuardMeta,
	LiteralsTypeGuardMeta as LsTGM,
	NeverTypeGuardMeta,
	NeverTypeGuardMeta as NTGM,
	ObjectTypeGuardMeta,
	ObjectTypeGuardMeta as OTTGM,
	OptionalTypeGuardMeta,
	OptionalTypeGuardMeta as OLTGM,
	PrimitiveTypeGuardMeta,
	PrimitiveTypeGuardMeta as PTGM,
	RecordTypeGuardMeta,
	RecordTypeGuardMeta as RDTGM,
	ReducibleTemplateLiteral,
	ReducibleTemplateLiteral as RTL,
	RestTypeGuardMeta,
	RestTypeGuardMeta as RTTGM,
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