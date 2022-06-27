import type { InferTypeGuard, TypeGuard } from 'r-assign/lib';

/**
 * Check for record values
 */
declare function isRecordOf<
	K extends TypeGuard<keyof any>,
	V extends TypeGuard
>(keys: K, values: V): TypeGuard<Record<InferTypeGuard<K>, InferTypeGuard<V>>>;

/**
 * Check for record values
 */
declare function isRecordOf<V extends TypeGuard>(
	values: V
): TypeGuard<Record<string, InferTypeGuard<V>>>;

export {
	isRecordOf,
	isRecordOf as record
};