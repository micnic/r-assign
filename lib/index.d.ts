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

export type OptionalObject<T> = Pick<T, {
		[key in keyof T]: undefined extends T[key] ? never : key;
	}[keyof T]> &
	Partial<Pick<T,{
		[key in keyof T]: undefined extends T[key] ? key : never;
	}[keyof T]>> extends infer R
	? { [P in keyof R]: R[P] }
	: never;

export type OptionalTuple<T extends any[]> = T extends [infer H, ...infer R]
	? undefined extends H
		? [...Partial<[H]>, ...OptionalTuple<R>]
		: [H, ...OptionalTuple<R>]
	: T extends []
	? []
	: never;

export type TypeGuard<T = any> = (value?: any) => value is T;

export type InferTypeGuard<T extends TypeGuard> = T extends TypeGuard<infer U>
	? U
	: never;