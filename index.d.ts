type KeysOfType<T, U> = {
	[key in keyof T]: U extends T[key] ? key : never;
}[keyof T];

type OptionalPartial<T, K extends keyof T> = Partial<Pick<T, K>> &
	Omit<T, K> extends infer R
	? { [P in keyof R]: R[P] }
	: never;

type OptionalUndefined<T> = OptionalPartial<T, KeysOfType<T, undefined>>;

declare namespace rAssign {
	type TransformFunction<T = any> = (
		value: any,
		key: string,
		source: any
	) => T;

	type TransformSchema<T = any> = {
		[key in keyof T]: TransformFunction<T[key]>;
	};

	type TransformResult<S extends TransformSchema> = OptionalUndefined<
		{ [key in keyof S]: ReturnType<S[key]> }
	>;
}

/**
 * Assign object properties and transform result based on the provided schema
 */
declare const rAssign: <S extends rAssign.TransformSchema>(
	schema: S,
	...sources: any[]
) => rAssign.TransformResult<S>;

export = rAssign;