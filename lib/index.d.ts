type Instance<T = any> = new (...args: any) => T;

type InferInstance<T extends Instance> = T extends Instance<infer I>
	? I
	: never;

type Literal = bigint | boolean | null | number | string | undefined;
type TypeGuard<T = any> = ((value?: any) => value is T) & {};
type AnyTag = { any: true };
type AnyTypeGuard = TypeGuard & AnyTag;
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
	TypeGuard,
	TypeGuard,
	...TypeGuard[]
];

type InferIntersection<T extends Intersection> = {
	[K in keyof T]: T[K] extends TypeGuard ? (parameter: T[K]) => void : never;
}[number] extends (k: TypeGuard<infer I>) => void
	? any extends I
		? never
		: I
	: never;

type Stringify<T> = T extends TypeGuard<Literal>
	? `${InferTypeGuard<NotOptionalTypeGuard<T>>}`
	: T extends Literal
	? `${T}`
	: never;

type TemplateLiteral<L extends Literal = any> = [] | (TypeGuard<L> | L)[];

type InferTemplateLiteral<T extends TemplateLiteral> = T extends []
	? ''
	: T extends [infer G]
	? Stringify<G>
	: T extends [infer H, ...infer R]
	? H extends TypeGuard<infer O>
		? O extends object
			? never
			: R extends TemplateLiteral
			? `${Stringify<H>}${InferTemplateLiteral<R>}`
			: never
		: H extends Literal
		? R extends TemplateLiteral
			? `${Stringify<H>}${InferTemplateLiteral<R>}`
			: never
		: never
	: never;

type Tuple = [] | TypeGuard[];

type InferTupleRest<T extends Tuple> = T extends []
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

type InferTuple<T extends Tuple> = T extends []
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
} & {};

type InferShape<S extends Shape> = OptionalShape<
	S,
	KeysOfType<S, OptionalTypeGuard>
> & {};

type Union = [
	TypeGuard,
	TypeGuard,
	...TypeGuard[]
];

type ValidateUnion<T extends TypeGuard[]> = T extends []
	? T
	: T extends [infer G]
	? G extends AnyTypeGuard
		? never
		: G extends OptionalTypeGuard
		? never
		: G extends TypeGuard
		? [G]
		: never
	: T extends [infer H, ...infer R]
	? H extends AnyTypeGuard
		? never
		: H extends OptionalTypeGuard
		? never
		: H extends TypeGuard
		? R extends TypeGuard[]
			? [H, ...ValidateUnion<R>]
			: never
		: never
	: never;

type InferUnion<T extends Union> = ValidateUnion<T> extends TypeGuard<
	infer U
>[]
	? any extends U
		? never
		: U
	: never;

export * from 'r-assign/lib/any';
export * from 'r-assign/lib/array';
export * from 'r-assign/lib/bigint';
export * from 'r-assign/lib/boolean';
export * from 'r-assign/lib/date';
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
export * from 'r-assign/lib/template-literal';
export * from 'r-assign/lib/tuple';
export * from 'r-assign/lib/undefined';
export * from 'r-assign/lib/union';

export {
	AnyTypeGuard,
	AnyTypeGuard as ATG,
	InferFunction,
	InferFunction as InferF,
	InferInstance,
	InferInstance as InferIns,
	InferIntersection,
	InferIntersection as InferInt,
	InferShape,
	InferShape as InferS,
	InferTemplateLiteral,
	InferTemplateLiteral as InferTL,
	InferTuple,
	InferTuple as InferT,
	InferTypeGuard,
	InferTypeGuard as InferTG,
	InferUnion,
	InferUnion as InferU,
	Instance,
	Intersection,
	Literal,
	NotOptionalTypeGuard,
	NotOptionalTypeGuard as NOTG,
	OptionalTypeGuard,
	OptionalTypeGuard as OTG,
	Shape,
	TemplateLiteral,
	TemplateLiteral as TL,
	Tuple,
	TypeGuard,
	TypeGuard as TG,
	Union
};