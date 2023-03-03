'use strict';

const { invalidInitialValue } = require('r-assign/lib/internal/invalid-type');
const { pickValue, refineValue } = require('r-assign/lib/internal/pick-value');
const {
	assertBaseTypeGuard,
	getTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').InferTG<T>} InferTypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').BTG<T>} BaseTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').RF<T>} RefineFunction
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
const getType = (type, initial, refine) => {

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

module.exports = { getType };