import {
	assertBaseTypeGuard,
	getTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').BTG<T>} BaseTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').InferT<T>} InferType
 */

const { isArray } = Array;

/**
 * Check for array values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @returns {TypeGuard<InferType<T>[]>}
 */
export const isArrayOf = (type) => {

	const child = getTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseTypeGuard(child.classification);

	/** @type {TypeGuard<InferType<T>[]>} */
	const check = (value) => {

		// Check for non-array values
		if (!isArray(value)) {
			return false;
		}

		// Loop array elements to check them
		for (const element of value) {
			if (!type(element)) {
				return false;
			}
		}

		return true;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		check,
		child,
		classification: 'array',
		type
	});

	return check;
};

export { isArrayOf as array };