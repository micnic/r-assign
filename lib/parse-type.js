import { invalidValue } from './internal/invalid-type.js';
import { pickValue, refineValue } from './internal/pick-value.js';
import {
	assertBaseTypeGuard,
	getTypeGuardMeta
} from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').InferTG<T>} InferTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').BTG<T>} BaseTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign').RF<T>} RefineFunction
 */

/**
 * Extract and validate values based on the provided type guard
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @param {RefineFunction<InferTypeGuard<T>>} [refine]
 * @returns {TransformFunction<InferTypeGuard<T>>}
 */
export const parseType = (type, refine) => {

	const meta = getTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseTypeGuard(meta.classification);

	/**
	 * Assert value to be of a valid type
	 * @param {unknown} value
	 * @param {string} [key]
	 * @returns {asserts value is InferTypeGuard<T>}
	 */
	const assert = (value, key) => {

		// Throw for invalid value type
		if (!type(value)) {
			throw TypeError(invalidValue(type, value, key));
		}
	};

	// Check for refine function to optimize performance on value processing
	if (refine) {
		return (value, key) => {

			// Throw for invalid value type
			assert(value, key);

			return refineValue(pickValue(value, meta), type, refine);
		};
	}

	return (value, key) => {

		// Throw for invalid value type
		assert(value, key);

		return pickValue(value, meta);
	};
};