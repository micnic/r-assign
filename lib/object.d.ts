import type { InferShape, Shape, TypeGuard } from 'r-assign';

/**
 * Check for keys of provided object type
 */
export declare function isKeyOf<R extends Record<keyof any, any>>(
	object: TypeGuard<R>
): TypeGuard<keyof R>;

/**
 * Check for object values
 */
export declare function isObjectOf<
	S extends Shape,
	M extends TypeGuard<Record<keyof any, any>> | undefined = undefined
>(shape: S, mapping?: M): TypeGuard<InferShape<S, M>>;

/**
 * Check for a subset object value by omitting the provided keys
 */
export declare function isOmitFrom<
	R extends Record<keyof any, any>,
	K extends keyof R
>(object: TypeGuard<R>, keys: K | K[] | TypeGuard<K>): TypeGuard<Omit<R, K>>;

/**
 * Check for a subset object value by picking the provided keys
 */
export declare function isPickFrom<
	R extends Record<keyof any, any>,
	K extends keyof R
>(object: TypeGuard<R>, keys: K | K[] | TypeGuard<K>): TypeGuard<Pick<R, K>>;

/**
 * Set strict flag for the provided object type guard
 */
export declare function setStrict<T extends TypeGuard<Record<keyof any, any>>>(
	type: T,
	value?: boolean
): T;

export {
	isKeyOf as keyof,
	isObjectOf as object,
	isOmitFrom as omit,
	isPickFrom as pick,
	setStrict as strict
};

export type { InferShape, Shape };