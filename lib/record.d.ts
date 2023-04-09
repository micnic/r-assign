import type {
	BaseTypeGuard,
	InferShape,
	InferType,
	Shape,
	TypeGuard
} from 'r-assign';
import { RemapObject } from './internal/index.js';

/**
 * Check for record values
 */
export declare function isRecordOf<V extends TypeGuard>(
	values: BaseTypeGuard<V>
): TypeGuard<Record<string, InferType<V>>>;

/**
 * Check for record values
 */
export declare function isRecordOf<V extends TypeGuard, S extends Shape>(
	values: BaseTypeGuard<V>,
	shape: S
): TypeGuard<RemapObject<Record<string, InferType<V>> & InferShape<S>>>;

/**
 * Check for record values
 */
export declare function isRecordOf<
	K extends TypeGuard<keyof any>,
	V extends TypeGuard
>(
	keys: K,
	values: BaseTypeGuard<V>
): TypeGuard<Record<InferType<K>, InferType<V>>>;

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
): TypeGuard<RemapObject<Record<InferType<K>, InferType<V>> & InferShape<S>>>;

export { isRecordOf as record };