'use strict';

const { invalidValue } = require('r-assign/lib/internal/invalid-type');
const { refineValue, takeValue } = require('r-assign/lib/internal/pick-value');
const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

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
 * @typedef {import('r-assign/lib').NOTG<T>} NotOptionalTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').RF<T>} RefineFunction
 */

const invalidBaseTypeGuard = 'Optional type guard cannot be used as base';

/**
 * Extract and validate values based on the provided type guard
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {NotOptionalTypeGuard<T>} type
 * @param {RefineFunction<InferTypeGuard<T>>} [refine]
 * @returns {TransformFunction<InferTypeGuard<T>>}
 */
const parseType = (type, refine) => {

	const { classification } = getTypeGuardMeta(type);

	// Check for invalid optional type guard
	if (classification === 'optional') {
		throw TypeError(invalidBaseTypeGuard);
	}

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

			return refineValue(
				takeValue(value, type, classification),
				type,
				refine
			);
		};
	}

	return (value, key) => {

		// Throw for invalid value type
		assert(value, key);

		return takeValue(value, type, classification);
	};
};

module.exports = { parseType };