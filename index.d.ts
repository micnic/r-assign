import type { OptionalObject } from 'r-assign/lib';

declare namespace rAssign {
	type TransformFunction<T = any> = (
		value: any,
		key: string,
		source: any
	) => T;

	type TransformSchema<T> = {
		[key in keyof T]: TransformFunction<T[key]>;
	};

	type InferType<S extends TransformSchema<any>> = OptionalObject<
		{ [key in keyof S]: ReturnType<S[key]> }
	>;
}

/**
 * Assign object properties and transform result based on the provided schema
 */
declare const rAssign: <
	S extends rAssign.TransformSchema<any>,
	T extends Record<string, any>
>(
	schema: S,
	...sources: [T, ...T[]]
) => rAssign.InferType<S>;

export = rAssign;