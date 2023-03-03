import type { RemapObject } from 'r-assign/lib/internal';

type Constructor<T = any> = new (...args: any) => T;

type InferConstructor<T extends Constructor> = T extends Constructor<infer I>
	? I
	: never;

type Literal = bigint | boolean | null | number | string | undefined;
type Literals<L extends Literal> = [L, ...L[]];

type InferLiterals<
	L extends Literal,
	T extends Literals<L>
> = T extends (infer S)[] ? S : never;

type PartialUndefined<T> = {
	[P in keyof T]?: T[P] | undefined;
};

type TypeGuard<T = any> = ((value?: any) => value is T) & {};
type CompositeTypeGuard<T> = T extends never ? never : TypeGuard<T>;

type AnyTag = { any: true };
type AnyTypeGuard = TypeGuard & AnyTag;

type OptionalTag = { optional: true };
type OptionalTypeGuard<T = any> = TypeGuard<T | unknown> & OptionalTag;

type RestTag = { rest: true };
type RestTypeGuard<T = any> = TypeGuard<(T | unknown)[]> & RestTag;

type BaseTypeGuard<T extends TypeGuard> = T extends OptionalTypeGuard
	? never
	: T extends RestTypeGuard
	? never
	: T;

type InferTypeGuard<G extends TypeGuard> = G extends OptionalTypeGuard<infer T>
	? T
	: G extends TypeGuard<infer T>
	? T
	: never;

type InferRestTypeGuard<G extends RestTypeGuard> = G extends RestTypeGuard<
	infer T
>
	? T[]
	: never;

type Intersection = [TypeGuard, TypeGuard, ...TypeGuard[]];

type InferIntersection<T extends Intersection> = T extends [infer F, infer S]
	? F extends TypeGuard
		? S extends TypeGuard
			? InferTypeGuard<F> & InferTypeGuard<S> extends infer I
				? RemapObject<I>
				: never
			: never
		: never
	: T extends [infer F, infer S, ...infer R]
	? F extends TypeGuard
		? S extends TypeGuard
			? R extends TypeGuard[]
				? [
						TypeGuard<InferTypeGuard<F> & InferTypeGuard<S>>,
						...R
				] extends infer I
					? I extends Intersection
						? InferIntersection<I>
						: never
					: never
				: never
			: never
		: never
	: never;

type InferPromise<T extends TypeGuard> = Promise<InferTypeGuard<T>>;

type Stringify<T> = T extends TypeGuard<Literal>
	? `${InferTypeGuard<T>}`
	: T extends Literal
	? `${T}`
	: never;

type TemplateLiteral<L extends Literal = any> = (TypeGuard<L> | L)[] | [];

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

type Tuple = TypeGuard[] | [];

type InferTupleWithRest<T extends Tuple> = T extends []
	? []
	: T extends [infer G]
	? G extends OptionalTypeGuard
		? never
		: G extends RestTypeGuard
		? never
		: G extends TypeGuard
		? [InferTypeGuard<G>]
		: never
	: T extends [infer H, ...infer R]
	? H extends OptionalTypeGuard
		? never
		: H extends RestTypeGuard
		? never
		: H extends TypeGuard
		? R extends Tuple
			? [InferTypeGuard<H>, ...InferTupleWithRest<R>]
			: never
		: never
	: never;

type InferTupleWithOptional<T extends Tuple> = T extends []
	? []
	: T extends [infer G]
	? G extends OptionalTypeGuard
		? [InferTypeGuard<G>?]
		: G extends RestTypeGuard
		? InferRestTypeGuard<G>
		: never
	: T extends [infer H, ...infer R]
	? H extends OptionalTypeGuard
		? R extends Tuple
			? [InferTypeGuard<H>?, ...InferTupleWithOptional<R>]
			: never
		: H extends RestTypeGuard
		? R extends Tuple
			? [...InferRestTypeGuard<H>, ...InferTupleWithRest<R>]
			: never
		: never
	: never;

type InferTuple<T extends Tuple> = T extends []
	? []
	: T extends [infer G]
	? G extends OptionalTypeGuard
		? [InferTypeGuard<G>?]
		: G extends RestTypeGuard
		? InferRestTypeGuard<G>
		: G extends TypeGuard
		? [InferTypeGuard<G>]
		: never
	: T extends [infer H, ...infer R]
	? H extends OptionalTypeGuard
		? R extends Tuple
			? [InferTypeGuard<H>?, ...InferTupleWithOptional<R>]
			: never
		: H extends RestTypeGuard
		? R extends Tuple
			? [...InferRestTypeGuard<H>, ...InferTupleWithRest<R>]
			: never
		: H extends TypeGuard
		? R extends Tuple
			? [InferTypeGuard<H>, ...InferTuple<R>]
			: never
		: never
	: never;

type InferFunction<T extends Tuple, R extends TypeGuard> = ((
	...args: InferTuple<T>
) => InferTypeGuard<R>) & {};

type InferAsyncFunction<T extends Tuple, R extends TypeGuard> = ((
	...args: InferTuple<T>
) => Promise<InferTypeGuard<R>>) & {};

type Shape = Record<string, TypeGuard>;

type KeysOfType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type OptionalShape<S extends Shape, K extends keyof S> = {
	[P in keyof (Omit<S, K> & Partial<Pick<S, K>>)]: P extends keyof S
		? S[P] extends RestTypeGuard
			? never
			: InferTypeGuard<S[P]>
		: never;
} & {};

type InferShape<
	S extends Shape,
	M extends TypeGuard<Record<keyof any, any>> | undefined = undefined
> = RemapObject<
	OptionalShape<S, KeysOfType<S, OptionalTypeGuard>> &
		(M extends undefined
			? {}
			: M extends TypeGuard
			? InferTypeGuard<BaseTypeGuard<M>>
			: never)
>;

type Union = [TypeGuard, TypeGuard, ...TypeGuard[]];

type InferUnion<T extends Union> = T extends TypeGuard<infer U>[] ? U : never;

type RefineFunction<T> = (value: T) => T;

export * from 'r-assign/lib/any';
export * from 'r-assign/lib/array';
export * from 'r-assign/lib/assert-type';
export * from 'r-assign/lib/bigint';
export * from 'r-assign/lib/boolean';
export * from 'r-assign/lib/date';
export * from 'r-assign/lib/function';
export * from 'r-assign/lib/get-type';
export * from 'r-assign/lib/instance';
export * from 'r-assign/lib/intersection';
export * from 'r-assign/lib/literal';
export * from 'r-assign/lib/never';
export * from 'r-assign/lib/null';
export * from 'r-assign/lib/number';
export * from 'r-assign/lib/object';
export * from 'r-assign/lib/optional';
export * from 'r-assign/lib/parse-type';
export * from 'r-assign/lib/partial';
export * from 'r-assign/lib/promise';
export * from 'r-assign/lib/record';
export * from 'r-assign/lib/required';
export * from 'r-assign/lib/same';
export * from 'r-assign/lib/string';
export * from 'r-assign/lib/symbol';
export * from 'r-assign/lib/template-literal';
export * from 'r-assign/lib/tuple';
export * from 'r-assign/lib/undefined';
export * from 'r-assign/lib/union';

export type {
	AnyTypeGuard,
	AnyTypeGuard as ATG,
	BaseTypeGuard,
	BaseTypeGuard as BTG,
	CompositeTypeGuard,
	CompositeTypeGuard as CTG,
	Constructor,
	InferAsyncFunction,
	InferAsyncFunction as InferAF,
	InferConstructor,
	InferConstructor as InferC,
	InferFunction,
	InferFunction as InferF,
	InferIntersection,
	InferIntersection as InferInt,
	InferLiterals,
	InferLiterals as InferL,
	InferPromise,
	InferPromise as InferP,
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
	Intersection,
	Literal,
	Literals,
	OptionalTypeGuard,
	OptionalTypeGuard as OTG,
	PartialUndefined,
	PartialUndefined as PU,
	RefineFunction,
	RefineFunction as RF,
	RestTypeGuard,
	RestTypeGuard as RTG,
	Shape,
	TemplateLiteral,
	TemplateLiteral as TL,
	Tuple,
	TypeGuard,
	TypeGuard as TG,
	Union
};