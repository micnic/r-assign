import type { BaseTypeGuard, InferTypeGuard, TypeGuard } from 'r-assign';

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
export declare function isRecordOf<V extends TypeGuard>(
	values: BaseTypeGuard<V>
): TypeGuard<Record<string, InferTypeGuard<V>>>;

export { isRecordOf as record };