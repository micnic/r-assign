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

export type RemapObject<T> = T extends any[] | Function
	? T
	: { [K in keyof T]: T[K] };

export type StringifiedTemplateLiteral<L extends Literal = any> =
	(TypeGuard<L> | string)[];

export { type StringifiedTemplateLiteral as STL };

export type ReducibleTemplateLiteral<S extends string> = (TypeGuard<S> | S)[];
export { type ReducibleTemplateLiteral as RTL };

export type AnyTypeGuardMeta = {
	check: TypeGuard;
	classification: 'any';
};

export { type AnyTypeGuardMeta as ATGM };

export type ArrayTypeGuardMeta = {
	check: TypeGuard<any[]>;
	child: BaseTypeGuardMeta;
	classification: 'array';
	type: TypeGuard;
};

export { type ArrayTypeGuardMeta as ARTGM };

export type FunctionTypeGuardMeta = {
	check: TypeGuard<(...args: any[]) => any>;
	children: [ArrayTypeGuardMeta | TupleTypeGuardMeta, BaseTypeGuardMeta];
	classification: 'function';
	types: [TypeGuard<any[] | []>, TypeGuard | undefined];
};

export { type FunctionTypeGuardMeta as FTGM };

export type InstanceTypeGuardMeta = {
	builder: Constructor;
	check: TypeGuard;
	classification: 'instance';
};

export { type InstanceTypeGuardMeta as INTGM };

export type IntersectionChild =
	| ArrayTypeGuardMeta
	| FunctionTypeGuardMeta
	| InstanceTypeGuardMeta
	| LiteralTypeGuardMeta
	| LiteralsTypeGuardMeta
	| NeverTypeGuardMeta
	| ObjectTypeGuardMeta
	| PrimitiveTypeGuardMeta
	| PromiseTypeGuardMeta
	| RecordTypeGuardMeta
	| TemplateLiteralTypeGuardMeta
	| TupleTypeGuardMeta
	| UnionTypeGuardMeta
	| VoidTypeGuardMeta;

export { type IntersectionChild as IC };

export type IntersectionTypeGuardMeta = {
	check: TypeGuard;
	children: IntersectionChild[];
	classification: 'intersection';
	intersection: Intersection;
};

export { type IntersectionTypeGuardMeta as ITGM };

export type LiteralTypeGuardMeta = {
	check: TypeGuard<Literal>;
	classification: 'literal';
	literal: Literal;
};

export { type LiteralTypeGuardMeta as LTGM };

export type LiteralsTypeGuardMeta = {
	check: TypeGuard<Literal>;
	classification: 'literals';
	literals: Literal[];
};

export { type LiteralsTypeGuardMeta as LSTGM };

export type NeverTypeGuardMeta = {
	check: TypeGuard<never>;
	classification: 'never';
};

export { type NeverTypeGuardMeta as NTGM };

export type ObjectTypeGuardMeta = {
	all: Map<string, Exclude<TypeGuardMeta, RestTypeGuardMeta>>;
	check: TypeGuard<Record<keyof any, any>>;
	classification: 'object';
	keys: string[];
	optional: Map<string, OptionalTypeGuardMeta>;
	required: Map<string, BaseTypeGuardMeta>;
	strict: boolean;
};

export { type ObjectTypeGuardMeta as OTGM };

type OptionalChild =
	| AnyTypeGuardMeta
	| ArrayTypeGuardMeta
	| FunctionTypeGuardMeta
	| InstanceTypeGuardMeta
	| IntersectionTypeGuardMeta
	| LiteralTypeGuardMeta
	| LiteralsTypeGuardMeta
	| NeverTypeGuardMeta
	| ObjectTypeGuardMeta
	| PrimitiveTypeGuardMeta
	| PromiseTypeGuardMeta
	| RecordTypeGuardMeta
	| TemplateLiteralTypeGuardMeta
	| TupleTypeGuardMeta
	| UnionTypeGuardMeta
	| VoidTypeGuardMeta;

export type OptionalTypeGuardMeta = {
	check: OptionalTypeGuard;
	child: OptionalChild;
	classification: 'optional';
	def?: () => any;
	type: TypeGuard;
	undef: boolean;
};

export { type OptionalTypeGuardMeta as OPTGM };

export type PrimitiveType =
	| 'bigint'
	| 'boolean'
	| 'number'
	| 'string'
	| 'symbol';

export { type PrimitiveType as PT };

export type PrimitiveTypeGuardMeta<T extends PrimitiveType = PrimitiveType> = {
	check: TypeGuard<bigint | boolean | number | string | symbol>;
	classification: 'primitive';
	primitive: T;
};

export { type PrimitiveTypeGuardMeta as PTGM };

export type PromiseTypeGuardMeta = {
	check: TypeGuard<Promise<any>>;
	child: BaseTypeGuardMeta;
	classification: 'promise';
	type: TypeGuard | undefined;
};

export { type PromiseTypeGuardMeta as PRTGM };

export type RecordKeyChild =
	| AnyTypeGuardMeta
	| LiteralTypeGuardMeta
	| LiteralsTypeGuardMeta
	| PrimitiveTypeGuardMeta<'number' | 'string' | 'symbol'>
	| TemplateLiteralTypeGuardMeta
	| UnionTypeGuardMeta<
			| LiteralTypeGuardMeta
			| LiteralsTypeGuardMeta
			| PrimitiveTypeGuardMeta<'number' | 'string' | 'symbol'>
			| TemplateLiteralTypeGuardMeta
	>;

export { type RecordKeyChild as RKC };

export type RecordTypeGuardMeta = {
	check: TypeGuard<Record<keyof any, any>>;
	children: [
		RecordKeyChild,
		BaseTypeGuardMeta,
		ObjectTypeGuardMeta | undefined
	];
	classification: 'record';
	numeric: boolean;
	types: [
		TypeGuard<keyof any>,
		TypeGuard,
		TypeGuard<Record<string, any>> | undefined
	];
};

export { type RecordTypeGuardMeta as RTGM };

type RestChild =
	| AnyTypeGuardMeta
	| ArrayTypeGuardMeta
	| FunctionTypeGuardMeta
	| InstanceTypeGuardMeta
	| IntersectionTypeGuardMeta
	| LiteralTypeGuardMeta
	| LiteralsTypeGuardMeta
	| NeverTypeGuardMeta
	| ObjectTypeGuardMeta
	| PrimitiveTypeGuardMeta
	| PromiseTypeGuardMeta
	| RecordTypeGuardMeta
	| TemplateLiteralTypeGuardMeta
	| TupleTypeGuardMeta
	| UnionTypeGuardMeta
	| VoidTypeGuardMeta;

export type RestTypeGuardMeta = {
	check: RestTypeGuard;
	child: RestChild;
	classification: 'rest';
	type: TypeGuard;
};

export { type RestTypeGuardMeta as RETGM };

export type TemplateLiteralTypeGuardMeta = {
	check: TypeGuard<string>;
	classification: 'template-literal';
	regexp: RegExp;
	template: StringifiedTemplateLiteral;
};

export { type TemplateLiteralTypeGuardMeta as TLTGM };

export type TupleTypeGuardMeta = {
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

export { type TupleTypeGuardMeta as TTGM };

export type UnionChild =
	| ArrayTypeGuardMeta
	| FunctionTypeGuardMeta
	| InstanceTypeGuardMeta
	| IntersectionTypeGuardMeta
	| LiteralTypeGuardMeta
	| LiteralsTypeGuardMeta
	| ObjectTypeGuardMeta
	| PrimitiveTypeGuardMeta
	| PromiseTypeGuardMeta
	| RecordTypeGuardMeta
	| TemplateLiteralTypeGuardMeta
	| TupleTypeGuardMeta
	| VoidTypeGuardMeta;

export { type UnionChild as UC };

export type UnionTypeGuardMeta<T extends UnionChild = UnionChild> = {
	check: TypeGuard;
	children: T[];
	classification: 'union';
	union: Union;
};

export { type UnionTypeGuardMeta as UTGM };

export type VoidTypeGuardMeta = {
	check: TypeGuard<void>;
	classification: 'void';
};

export { type VoidTypeGuardMeta as VTGM };

export type TypeGuardMeta =
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

export { type TypeGuardMeta as TGM };

export type BaseTypeGuardMeta = Exclude<
	TypeGuardMeta,
	OptionalTypeGuardMeta | RestTypeGuardMeta
>;

export { type BaseTypeGuardMeta as BTGM };

export type TypeClassification = TypeGuardMeta['classification'];
export { type TypeClassification as TC };