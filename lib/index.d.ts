type Literal = bigint | boolean | null | number | string | symbol | undefined;

type TypeGuard<T = any> = ((value?: any) => value is T) & {};
type OptionalTag = { optional: true };
type OptionalTypeGuard<T = any> = TypeGuard<T | undefined> & OptionalTag;

type NotOptionalTypeGuard<T extends TypeGuard> = T extends OptionalTypeGuard
	? never
	: T;

type InferTypeGuard<G extends TypeGuard> = G extends OptionalTypeGuard<infer T>
	? T
	: G extends TypeGuard<infer T>
	? T
	: never;

type Intersection = [
	NotOptionalTypeGuard<TypeGuard>,
	NotOptionalTypeGuard<TypeGuard>,
	...NotOptionalTypeGuard<TypeGuard>[]
];

type InferIntersection<T extends Intersection> = {
	[K in keyof T]: T[K] extends TypeGuard ? (parameter: T[K]) => void : never;
}[number] extends (k: TypeGuard<infer I>) => void
	? I
	: never;

type Tuple = [] | TypeGuard[];

type InferTupleRest<T extends TypeGuard[]> = T extends []
	? T
	: T extends [infer G]
	? G extends OptionalTypeGuard
		? [InferTypeGuard<G>?]
		: never
	: T extends [infer H, ...infer R]
	? H extends OptionalTypeGuard
		? R extends OptionalTypeGuard[]
			? [InferTypeGuard<H>?, ...InferTupleRest<R>]
			: never
		: never
	: never;

type InferTuple<T extends TypeGuard[]> = T extends []
	? T
	: T extends [infer G]
	? G extends OptionalTypeGuard
		? [InferTypeGuard<G>?]
		: G extends TypeGuard
		? [InferTypeGuard<G>]
		: never
	: T extends [infer H, ...infer R]
	? H extends OptionalTypeGuard
		? R extends OptionalTypeGuard[]
			? [InferTypeGuard<H>?, ...InferTupleRest<R>]
			: R extends TypeGuard[]
			? [InferTypeGuard<H>?, ...InferTupleRest<R>]
			: never
		: H extends TypeGuard
		? R extends OptionalTypeGuard[]
			? [InferTypeGuard<H>, ...InferTuple<R>]
			: R extends TypeGuard[]
			? [InferTypeGuard<H>, ...InferTuple<R>]
			: never
		: never
	: never;

type InferFunction<
	T extends Tuple,
	R extends NotOptionalTypeGuard<TypeGuard>
> = ((...args: InferTuple<T>) => InferTypeGuard<R>) & {};

type Shape = {
	[key: string]: TypeGuard;
};

type KeysOfType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type OptionalShape<S extends Shape, T extends keyof S> = {
	[K in keyof (Omit<S, T> & Partial<Pick<S, T>>)]: K extends keyof S
		? InferTypeGuard<S[K]>
		: never;
};

type InferShape<S extends Shape> = OptionalShape<
	S,
	KeysOfType<S, OptionalTypeGuard>
>;

type Union = [
	NotOptionalTypeGuard<TypeGuard>,
	NotOptionalTypeGuard<TypeGuard>,
	...NotOptionalTypeGuard<TypeGuard>[]
];

type InferUnion<T extends Union> = T extends TypeGuard<infer U>[] ? U : never;

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
	type: TypeGuard;
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
	| { classification: 'any' | 'instance' | 'literal' | 'primitive' }
	| ArrayTypeGuardMeta
	| FunctionTypeGuardMeta
	| IntersectionTypeGuardMeta
	| NullableTypeGuardMeta
	| ObjectTypeGuardMeta
	| OptionalTypeGuardMeta
	| TupleTypeGuardMeta
	| UnionTypeGuardMeta
);

type TypeClassification = TypeGuardMeta['classification'];

export * from 'r-assign/lib/any';
export * from 'r-assign/lib/array';
export * from 'r-assign/lib/bigint';
export * from 'r-assign/lib/boolean';
export * from 'r-assign/lib/function';
export * from 'r-assign/lib/get-type';
export * from 'r-assign/lib/instance';
export * from 'r-assign/lib/intersection';
export * from 'r-assign/lib/literal';
export * from 'r-assign/lib/null';
export * from 'r-assign/lib/number';
export * from 'r-assign/lib/object';
export * from 'r-assign/lib/optional';
export * from 'r-assign/lib/parse-type';
export * from 'r-assign/lib/string';
export * from 'r-assign/lib/symbol';
export * from 'r-assign/lib/tuple';
export * from 'r-assign/lib/undefined';
export * from 'r-assign/lib/union';

export {
	InferFunction,
	InferIntersection,
	InferShape,
	InferTuple,
	InferTypeGuard,
	InferUnion,
	Intersection,
	Literal,
	NotOptionalTypeGuard,
	NotOptionalTypeGuard as NOTG,
	OptionalTypeGuard,
	OptionalTypeGuard as OTG,
	Shape,
	Tuple,
	TypeClassification,
	TypeClassification as TC,
	TypeGuard,
	TypeGuard as TG,
	TypeGuardMeta,
	TypeGuardMeta as TGM,
	Union
};