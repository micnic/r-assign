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

export type StringifiedTemplateLiteral<L extends Literal> =
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
	child: TypeGuardMeta;
	classification: 'array';
	type: TypeGuard;
};

export { type ArrayTypeGuardMeta as ARTGM };

export type FunctionTypeGuardMeta = {
	check: TypeGuard<(...args: any[]) => any>;
	children: [TypeGuardMeta, TypeGuardMeta];
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

export type IntersectionTypeGuardMeta = {
	check: TypeGuard;
	children: TypeGuardMeta[];
	classification: 'intersection';
	types: Intersection;
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
	all: Map<string, TypeGuardMeta>;
	check: TypeGuard<Record<keyof any, any>>;
	classification: 'object';
	keys: string[];
	optional: Map<string, OptionalTypeGuardMeta>;
	required: Map<string, Exclude<TypeGuardMeta, OptionalTypeGuardMeta>>;
	strict: boolean;
};

export { type ObjectTypeGuardMeta as OTGM };

export type OptionalTypeGuardMeta = {
	check: OptionalTypeGuard;
	child: TypeGuardMeta;
	classification: 'optional';
	def?: any | (() => any);
	type: TypeGuard;
	undef: boolean;
};

export { type OptionalTypeGuardMeta as OPTGM };

export type PrimitiveTypeGuardMeta = {
	check: TypeGuard<bigint | boolean | number | string | symbol>;
	classification: 'primitive';
	primitive: 'bigint' | 'boolean' | 'number' | 'string' | 'symbol';
};

export { type PrimitiveTypeGuardMeta as PTGM };

export type PromiseTypeGuardMeta = {
	check: TypeGuard<Promise<any>>;
	child: TypeGuardMeta;
	classification: 'promise';
	type: TypeGuard | undefined;
};

export { type PromiseTypeGuardMeta as PRTGM };

export type RecordTypeGuardMeta = {
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

export { type RecordTypeGuardMeta as RTGM };

export type RestTypeGuardMeta = {
	check: RestTypeGuard;
	child: TypeGuardMeta;
	classification: 'rest';
	type: TypeGuard;
};

export { type RestTypeGuardMeta as RETGM };

export type TemplateLiteralTypeGuardMeta = {
	check: TypeGuard<string>;
	classification: 'template-literal';
	regexp: RegExp;
	template: StringifiedTemplateLiteral<any>;
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

export type UnionTypeGuardMeta = {
	check: TypeGuard;
	children: TypeGuardMeta[];
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

export type TypeClassification = TypeGuardMeta['classification'];
export { type TypeClassification as TC };