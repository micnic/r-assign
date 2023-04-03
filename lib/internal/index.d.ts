import type {
	Constructor,
	Intersection,
	Literal,
	OptionalTypeGuard,
	RestTypeGuard,
	Tuple,
	TypeGuard,
	Union
} from 'r-assign';

type StringifiedTemplateLiteral<L extends Literal> = (TypeGuard<L> | string)[];
type ReducibleTemplateLiteral<S extends string> = (TypeGuard<S> | S)[];

type AnyTypeGuardMeta = {
	check: TypeGuard;
	classification: 'any';
};

type ArrayTypeGuardMeta = {
	check: TypeGuard<any[]>;
	child: TypeGuardMeta;
	classification: 'array';
	type: TypeGuard;
};

type FunctionTypeGuardMeta = {
	check: TypeGuard<(...args: any[]) => any>;
	children: [TypeGuardMeta, TypeGuardMeta];
	classification: 'function';
	types: [TypeGuard<any[] | []>, TypeGuard | undefined];
};

type InstanceTypeGuardMeta = {
	builder: Constructor;
	check: TypeGuard;
	classification: 'instance';
};

type IntersectionTypeGuardMeta = {
	check: TypeGuard;
	children: TypeGuardMeta[];
	classification: 'intersection';
	types: Intersection;
};

type LiteralTypeGuardMeta = {
	check: TypeGuard<Literal>;
	classification: 'literal';
	literal: Literal;
};

type LiteralsTypeGuardMeta = {
	check: TypeGuard<Literal>;
	classification: 'literals';
	literals: Literal[];
};

type NeverTypeGuardMeta = {
	check: TypeGuard<never>;
	classification: 'never';
};

type ObjectTypeGuardMeta = {
	all: Map<string, TypeGuardMeta>;
	check: TypeGuard<Record<keyof any, any>>;
	classification: 'object';
	keys: string[];
	optional: Map<string, OptionalTypeGuardMeta>;
	required: Map<string, Exclude<TypeGuardMeta, OptionalTypeGuardMeta>>;
	strict: boolean;
};

type OptionalTypeGuardMeta = {
	check: OptionalTypeGuard;
	child: TypeGuardMeta;
	classification: 'optional';
	def?: any | (() => any);
	type: TypeGuard;
	undef: boolean;
};

type PrimitiveTypeGuardMeta = {
	check: TypeGuard<bigint | boolean | number | string | symbol>;
	classification: 'primitive';
	primitive: 'bigint' | 'boolean' | 'number' | 'string' | 'symbol';
};

type PromiseTypeGuardMeta = {
	check: TypeGuard<Promise<any>>;
	child: TypeGuardMeta;
	classification: 'promise';
	type: TypeGuard | undefined;
};

type RecordTypeGuardMeta = {
	check: TypeGuard<Record<keyof any, any>>;
	children: [TypeGuardMeta, TypeGuardMeta, ObjectTypeGuardMeta | undefined];
	classification: 'record';
	numeric: boolean;
	types: [
		TypeGuard<keyof any>,
		TypeGuard,
		TypeGuard<Record<string, any>> | undefined
	];
};

type RestTypeGuardMeta = {
	check: RestTypeGuard;
	child: TypeGuardMeta;
	classification: 'rest';
	type: TypeGuard;
};

type TemplateLiteralTypeGuardMeta = {
	check: TypeGuard<string>;
	classification: 'template-literal';
	regexp: RegExp;
	template: StringifiedTemplateLiteral<any>;
};

type TupleTypeGuardMeta = {
	check: TypeGuard<any[] | []>;
	children: TypeGuardMeta[];
	classification: 'tuple';
	indexes: {
		optional: number;
		required: number;
		rest: number;
	};
	tuple: Tuple;
};

type UnionTypeGuardMeta = {
	check: TypeGuard;
	children: TypeGuardMeta[];
	classification: 'union';
	union: Union;
};

type VoidTypeGuardMeta = {
	check: TypeGuard<void>;
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
	PrimitiveTypeGuardMeta as PVTGM,
	PromiseTypeGuardMeta,
	PromiseTypeGuardMeta as PSTGM,
	RecordTypeGuardMeta,
	RecordTypeGuardMeta as RDTGM,
	ReducibleTemplateLiteral,
	ReducibleTemplateLiteral as RTL,
	RestTypeGuardMeta,
	RestTypeGuardMeta as RTTGM,
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
	UnionTypeGuardMeta as UTGM,
	VoidTypeGuardMeta,
	VoidTypeGuardMeta as VTGM
};