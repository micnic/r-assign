type UndefinedKeys<T> = {
	[K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

type OptionalObject<T> = Omit<T, UndefinedKeys<T>> &
	Partial<Pick<T, UndefinedKeys<T>>> extends infer R
	? { [K in keyof R]: Exclude<R[K], undefined> }
	: never;

export type TransformFunction<T = any> = (
	value?: unknown,
	key?: string,
	source?: unknown
) => T;

export type TransformSchema<T = any> = {
	[key in keyof T]: TransformFunction<T[key]>;
};

export type InferType<S extends TransformSchema> = OptionalObject<{
	[key in keyof S]: ReturnType<S[key]>;
}>;

/**
 * Assign object properties and parse result based on the provided schema
 */
declare function rAssign<T extends TypeGuard>(
	schema: BaseTypeGuard<T>,
	...sources: unknown[]
): InferTypeGuard<T>;

/**
 * Assign object properties and transform result based on the provided schema
 */
declare function rAssign<S extends TransformSchema>(
	schema: S,
	...sources: unknown[]
): InferType<S>;

export default rAssign;

type Constructor<T = any> = new (...args: any[]) => T;

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

interface OptionalTypeGuard<T = any> extends TypeGuard<T | unknown> {
	optional: true;
}

interface RestTypeGuard<T = any> extends TypeGuard<(T | unknown)[]> {
	rest: true;
}

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

type RemapObject<T> = T extends any[] | Function ? T : { [K in keyof T]: T[K] };

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

export * from './lib/any.js';
export * from './lib/array.js';
export * from './lib/assert-type.js';
export * from './lib/bigint.js';
export * from './lib/boolean.js';
export * from './lib/date.js';
export * from './lib/function.js';
export * from './lib/get-type.js';
export * from './lib/instance.js';
export * from './lib/intersection.js';
export * from './lib/literal.js';
export * from './lib/never.js';
export * from './lib/null.js';
export * from './lib/number.js';
export * from './lib/object.js';
export * from './lib/optional.js';
export * from './lib/parse-type.js';
export * from './lib/partial.js';
export * from './lib/promise.js';
export * from './lib/record.js';
export * from './lib/required.js';
export * from './lib/same.js';
export * from './lib/string.js';
export * from './lib/symbol.js';
export * from './lib/template-literal.js';
export * from './lib/tuple.js';
export * from './lib/undefined.js';
export * from './lib/union.js';

export type {
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