import type {
	BaseTypeGuard,
	InferShape,
	InferTypeGuard,
	Shape,
	TypeGuard
} from 'r-assign';

/**
 * Check for record values
 */
export declare function isRecordOf<V extends TypeGuard>(
	values: BaseTypeGuard<V>
): TypeGuard<Record<string, InferTypeGuard<V>>>;

/**
 * Check for record values
 */
export declare function isRecordOf<V extends TypeGuard, S extends Shape>(
	values: BaseTypeGuard<V>,
	shape: S
): TypeGuard<Record<string, InferTypeGuard<V>> & InferShape<S>>;

/**
 * Check for record values
 */
export declare function isRecordOf<
	K extends TypeGuard<keyof any>,
	V extends TypeGuard
>(
	keys: K,
	values: BaseTypeGuard<V>
): TypeGuard<Record<InferTypeGuard<K>, InferTypeGuard<V>>>;

/**
 * Check for record values
 */
export declare function isRecordOf<
	K extends TypeGuard<keyof any>,
	V extends TypeGuard,
	S extends Shape
>(
	keys: K,
	values: BaseTypeGuard<V>,
	shape: S
): TypeGuard<Record<InferTypeGuard<K>, InferTypeGuard<V>> & InferShape<S>>;

export { isRecordOf as record };