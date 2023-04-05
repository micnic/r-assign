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

export type InferTransform<S extends TransformSchema> = OptionalObject<{
	[key in keyof S]: ReturnType<S[key]>;
}>;

/**
 * Assign object properties and parse result based on the provided schema
 */
declare function rAssign<T extends TypeGuard>(
	schema: BaseTypeGuard<T>,
	...sources: unknown[]
): InferType<T>;

/**
 * Assign object properties and transform result based on the provided schema
 */
declare function rAssign<S extends TransformSchema>(
	schema: S,
	...sources: unknown[]
): InferTransform<S>;

export default rAssign;

export type Constructor<T = any> = new (...args: any[]) => T;

export type InferConstructor<T extends Constructor> = T extends Constructor<
	infer I
>
	? I
	: never;

export { type InferConstructor as InferC };

export type Literal = bigint | boolean | null | number | string | undefined;
export type Literals<L extends Literal> = [L, ...L[]];

export type InferLiterals<
	L extends Literal,
	T extends Literals<L>
> = T extends (infer S)[] ? S : never;

export { type InferLiterals as InferL };

export type PartialUndefined<T> = {
	[P in keyof T]?: T[P] | undefined;
};

export { type PartialUndefined as PU };

export type TypeGuard<T = any> = ((value?: any) => value is T) & {};
export { type TypeGuard as TG };

export interface OptionalTypeGuard<T = any> extends TypeGuard<T | unknown> {
	optional: true;
}

export { type OptionalTypeGuard as OTG };

export interface OptionalDefaultTypeGuard<T = any>
	extends OptionalTypeGuard<T> {
	default: true;
}

export { type OptionalDefaultTypeGuard as ODTG };

export interface RestTypeGuard<T = any> extends TypeGuard<(T | unknown)[]> {
	rest: true;
}

export { type RestTypeGuard as RTG };

export type BaseTypeGuard<T extends TypeGuard> = T extends
	| OptionalTypeGuard
	| RestTypeGuard
	? never
	: T;

export { type BaseTypeGuard as BTG };

export type InferType<G extends TypeGuard> = G extends
	| TypeGuard<infer T>
	| OptionalTypeGuard<infer T>
	? T
	: never;

export { type InferType as InferT };

export type InferRestTypeGuard<G extends RestTypeGuard> =
	G extends RestTypeGuard<infer T> ? T[] : never;

export type Intersection = [TypeGuard, TypeGuard, ...TypeGuard[]];

type RemapObject<T> = T extends any[] | Function ? T : { [K in keyof T]: T[K] };

export type InferIntersection<T extends Intersection> =
	T extends [infer F, infer S]
	? F extends TypeGuard
		? S extends TypeGuard
			? InferType<F> & InferType<S> extends infer I
				? RemapObject<I>
				: never
			: never
		: never
	: T extends [infer F, infer S, ...infer R]
	? F extends TypeGuard
		? S extends TypeGuard
			? R extends TypeGuard[]
				? [
						TypeGuard<InferType<F> & InferType<S>>,
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

export { type InferIntersection as InferI };

export type InferPromise<T extends TypeGuard> = Promise<InferType<T>>;
export { type InferPromise as InferP };

type Stringify<T> = T extends TypeGuard<Literal>
	? `${InferType<T>}`
	: T extends Literal
	? `${T}`
	: never;

export type TemplateLiteral<L extends Literal = any> =
	| (TypeGuard<L> | L)[]
	| [];

export type InferTemplateLiteral<T extends TemplateLiteral> = T extends []
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

export { type InferTemplateLiteral as InferTL };

export type Tuple = TypeGuard[] | [];

type InferTupleWithRest<T extends Tuple> = T extends []
	? []
	: T extends [infer G]
	? G extends OptionalTypeGuard
		? never
		: G extends RestTypeGuard
		? never
		: G extends TypeGuard
		? [InferType<G>]
		: never
	: T extends [infer H, ...infer R]
	? H extends OptionalTypeGuard
		? never
		: H extends RestTypeGuard
		? never
		: H extends TypeGuard
		? R extends Tuple
			? [InferType<H>, ...InferTupleWithRest<R>]
			: never
		: never
	: never;

type InferTupleWithOptional<T extends Tuple> = T extends []
	? []
	: T extends [infer G]
	? G extends OptionalTypeGuard
		? [InferType<G>?]
		: G extends RestTypeGuard
		? InferRestTypeGuard<G>
		: never
	: T extends [infer H, ...infer R]
	? H extends OptionalTypeGuard
		? R extends Tuple
			? [InferType<H>?, ...InferTupleWithOptional<R>]
			: never
		: H extends RestTypeGuard
		? R extends Tuple
			? [...InferRestTypeGuard<H>, ...InferTupleWithRest<R>]
			: never
		: never
	: never;

export type InferTuple<T extends Tuple> = T extends []
	? []
	: T extends [infer G]
	? G extends OptionalTypeGuard
		? [InferType<G>?]
		: G extends RestTypeGuard
		? InferRestTypeGuard<G>
		: G extends TypeGuard
		? [InferType<G>]
		: never
	: T extends [infer H, ...infer R]
	? H extends OptionalTypeGuard
		? R extends Tuple
			? [InferType<H>?, ...InferTupleWithOptional<R>]
			: never
		: H extends RestTypeGuard
		? R extends Tuple
			? [...InferRestTypeGuard<H>, ...InferTupleWithRest<R>]
			: never
		: H extends TypeGuard
		? R extends Tuple
			? [InferType<H>, ...InferTuple<R>]
			: never
		: never
	: never;

export { type InferTuple as InferTU };

export type InferFunction<T extends Tuple, R extends TypeGuard> = ((
	...args: InferTuple<T>
) => InferType<R>) & {};

export { type InferFunction as InferF };

export type InferAsyncFunction<T extends Tuple, R extends TypeGuard> = ((
	...args: InferTuple<T>
) => Promise<InferType<R>>) & {};

export { type InferAsyncFunction as InferAF };

export type Shape = Record<string, TypeGuard>;

type KeysOfType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type OptionalShape<S extends Shape, K extends keyof S> = {
	[P in keyof (Omit<S, K> & Partial<Pick<S, K>>)]: P extends keyof S
		? S[P] extends RestTypeGuard
			? never
			: InferType<S[P]>
		: never;
} & {};

export type InferShape<S extends Shape> = OptionalShape<
	S,
	KeysOfType<S, OptionalTypeGuard>
>;

export { type InferShape as InferS };

export type Union = TypeGuard[];

export type InferUnion<T extends Union> = T extends []
	? never
	: T extends TypeGuard<infer U>[]
	? U
	: never;

export { type InferUnion as InferU };

export type RefineFunction<T> = (value: T) => T;
export { type RefineFunction as RF };

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
export * from './lib/string.js';
export * from './lib/symbol.js';
export * from './lib/template-literal.js';
export * from './lib/tuple.js';
export * from './lib/undefined.js';
export * from './lib/union.js';