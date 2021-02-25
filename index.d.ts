type KeysOfType<T, U> = {
	[key in keyof T]: U extends T[key] ? key : never;
}[keyof T];

type OptionalKeys<T> = Partial<Pick<T, KeysOfType<T, undefined>>>;
type RequiredKeys<T> = Omit<T, KeysOfType<T, undefined>>;
type OptionalUndefined<T> = OptionalKeys<T> & RequiredKeys<T>;

declare namespace rAssign {
	type TransformFunction<T = any> = (
		value: any,
		key: string,
		source: any
	) => T;

	type TransformSchema = {
		[key: string]: TransformFunction;
	};

	type TransformResult<S extends TransformSchema> = OptionalUndefined<
		{ [key in keyof S]: ReturnType<S[key]> }
	>;
}

/**
 * Assign object properties and transform result based on the provided schema
 */
declare function rAssign<S extends rAssign.TransformSchema>(
	schema: S,
	...sources: any[]
): OptionalUndefined<{ [key in keyof S]: ReturnType<S[key]> }>;

export = rAssign;