type UndefinedKeys<T> = {
	[K in keyof T]: T[K] extends undefined ? K : never;
}[keyof T];

type OptionalObject<T> = Omit<T, UndefinedKeys<T>> &
	Partial<Pick<T, UndefinedKeys<T>>> extends infer R
	? { [K in keyof R]: R[K] }
	: never;

declare namespace rAssign {
	type TransformFunction<T = any> = (
		value: unknown,
		key: string,
		source: unknown
	) => T;

	type TransformSchema<T> = {
		[key in keyof T]: TransformFunction<T[key]>;
	};

	type InferType<S extends TransformSchema<any>> = OptionalObject<{
		[key in keyof S]: ReturnType<S[key]>;
	}>;
}

/**
 * Assign object properties and transform result based on the provided schema
 */
declare function rAssign<
	S extends rAssign.TransformSchema<any>
>(schema: S, ...sources: unknown[]): rAssign.InferType<S>;

export = rAssign;