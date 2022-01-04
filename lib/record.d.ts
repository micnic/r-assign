import type { InferTypeGuard, TypeGuard } from 'r-assign/lib';

/**
 * Check for record values
 */
declare function isRecordOf<
	K extends TypeGuard<keyof any>,
	V extends TypeGuard
>(keys: K, values: V): TypeGuard<Record<InferTypeGuard<K>, InferTypeGuard<V>>>;

export {
	isRecordOf,
	isRecordOf as record
};