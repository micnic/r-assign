'use strict';

const { invalidInitialValue } = require('r-assign/lib/internal/invalid-type');
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
 * Extract values based on provided type guard and default value
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {NotOptionalTypeGuard<T>} type
 * @param {InferTypeGuard<T>} initial
 * @param {RefineFunction<InferTypeGuard<T>>} [refine]
 * @returns {TransformFunction<InferTypeGuard<T>>}
 */
const getType = (type, initial, refine) => {

	const { classification } = getTypeGuardMeta(type);

	// Check for invalid optional type guard
	if (classification === 'optional') {
		throw TypeError(invalidBaseTypeGuard);
	}

	// Check for default value to be of a valid type
	if (!type(initial)) {
		throw TypeError(invalidInitialValue(type, initial));
	}

	// Check for refine function to optimize performance on value processing
	if (refine) {
		return (value) => {

			// Check for valid value type
			if (type(value)) {
				return refineValue(
					takeValue(value, type, classification),
					type,
					refine
				);
			}

			return refineValue(
				takeValue(initial, type, classification),
				type,
				refine
			);
		};
	}

	return (value) => {

		// Check for valid value type
		if (type(value)) {
			return takeValue(value, type, classification);
		}

		return takeValue(initial, type, classification);
	};
};

module.exports = { getType };