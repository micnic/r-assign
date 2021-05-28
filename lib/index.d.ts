export * from 'r-assign/lib/any';
export * from 'r-assign/lib/array';
export * from 'r-assign/lib/bigint';
export * from 'r-assign/lib/boolean';
export * from 'r-assign/lib/instance';
export * from 'r-assign/lib/intersection';
export * from 'r-assign/lib/literal';
export * from 'r-assign/lib/null';
export * from 'r-assign/lib/number';
export * from 'r-assign/lib/object';
export * from 'r-assign/lib/optional';
export * from 'r-assign/lib/string';
export * from 'r-assign/lib/symbol';
export * from 'r-assign/lib/tuple';
export * from 'r-assign/lib/union';

type UndefinedKeys<T> = {
	[key in keyof T]: undefined extends T[key] ? never : key;
}[keyof T];

export type OptionalObject<T> = Pick<T, UndefinedKeys<T>> &
	Partial<Omit<T, UndefinedKeys<T>>> extends infer R
	? { [P in keyof R]: R[P] }
	: never;

export type OptionalTuple<T extends any[]> = T extends [infer H, ...infer R]
	? undefined extends H
		? [...Partial<[H]>, ...OptionalTuple<R>]
		: [H, ...OptionalTuple<R>]
	: T extends []
	? []
	: never;

export type TypeClassification =
	| 'any'
	| 'array'
	| 'intersection'
	| 'instance'
	| 'literal'
	| 'object'
	| 'optional'
	| 'primitive'
	| 'tuple'
	| 'union';

export type TypeGuard<T = any> = (value?: any) => value is T;

export type TypeGuardMeta = {
	annotation: string;
	classification: TypeClassification;
	description: string;
};

export type InferTypeGuard<G extends TypeGuard> = G extends TypeGuard<infer T>
	? T
	: never;