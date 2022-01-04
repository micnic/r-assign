import type {
	AnyTypeGuard,
	Constructor,
	Literal,
	OptionalTypeGuard,
	Shape,
	Tuple,
	TypeGuard,
	Union
} from 'r-assign/lib';

type Primitive = bigint | boolean | number | string | symbol;

type StringifiedTemplateLiteral<L extends Literal> = (TypeGuard<L> | string)[];
type ReducibleTemplateLiteral<S extends string> = (TypeGuard<S> | S)[];

type BaseTypeGuardMeta = {
	annotation: string;
	description: string;
};

type AnyTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'any';
	main: AnyTypeGuard;
};

type ArrayTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'array';
	main: TypeGuard<any[]>;
	type: TypeGuard;
};

type FunctionTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'function';
	args: TypeGuard<any[] | []>;
	main: TypeGuard<(...args: any[]) => any>;
	result: TypeGuard | undefined;
};

type InstanceTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'instance';
	constructor: Constructor;
	main: TypeGuard;
};

type LiteralTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'literal';
	literal: Literal;
	main: TypeGuard<Literal>;
};

type LiteralsTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'literals';
	literals: Literal[];
	main: TypeGuard<Literal>;
};

type ObjectTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'object';
	main: TypeGuard<Record<string, any>>;
	mapping?: TypeGuard<Record<keyof any, any>> | undefined;
	shape: Shape;
	strict: boolean;
};

type OptionalTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'optional';
	main: OptionalTypeGuard;
	undef: boolean;
	type: TypeGuard;
};

type PrimitiveTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'primitive';
	main: TypeGuard<Primitive>;
	primitive: 'bigint' | 'boolean' | 'number' | 'string' | 'symbol';
};

type RecordTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'record';
	keys: TypeGuard<keyof any>;
	main: TypeGuard<Record<keyof any, any>>;
	values: TypeGuard;
};

type TemplateLiteralTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'template-literal';
	main: TypeGuard<string>;
	regexp: RegExp;
	template: StringifiedTemplateLiteral<any>;
};

type TupleTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'tuple';
	main: TypeGuard<[] | any[]>;
	tuple: Tuple;
};

type UnionTypeGuardMeta = BaseTypeGuardMeta & {
	classification: 'union';
	main: TypeGuard;
	union: Union;
};

type TypeGuardMeta =
	| AnyTypeGuardMeta
	| ArrayTypeGuardMeta
	| FunctionTypeGuardMeta
	| InstanceTypeGuardMeta
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