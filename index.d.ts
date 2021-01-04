declare namespace rAssign {
	type TransformSchema = {
		[key: string]: (value: any, key: string, source: any) => any;
	};
}

/**
 * Assign object properties and transform result based on the provided schema
 */
declare function rAssign<S extends rAssign.TransformSchema>(schema: S, ...sources: any[]): { [key in keyof S]: ReturnType<S[key]> };

export = rAssign;