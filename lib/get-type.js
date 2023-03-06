import { invalidInitialValue } from './internal/invalid-type.js';
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
 * Extract values based on provided type guard and default value
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {BaseTypeGuard<T>} type
 * @param {InferTypeGuard<T>} initial
 * @param {RefineFunction<InferTypeGuard<T>>} [refine]
 * @returns {TransformFunction<InferTypeGuard<T>>}
 */
export const getType = (type, initial, refine) => {

	const meta = getTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseTypeGuard(meta.classification);

	// Check for default value to be of a valid type
	if (!type(initial)) {
		throw TypeError(invalidInitialValue(type, initial));
	}

	// Check for refine function to optimize performance on value processing
	if (refine) {
		return (value) => {

			// Check for valid value type
			if (type(value)) {
				return refineValue(pickValue(value, meta), type, refine);
			}

			return refineValue(pickValue(initial, meta), type, refine);
		};
	}

	return (value) => {

		// Check for valid value type
		if (type(value)) {
			return pickValue(value, meta);
		}

		return pickValue(initial, meta);
	};
};