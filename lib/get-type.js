'use strict';

const { invalidInitialValue } = require('r-assign/lib/internal/invalid-type');
const { pickValue } = require('r-assign/lib/internal/pick-value');
const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').NOTG<T>} NotOptionalTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

const invalidBaseTypeGuard = 'Optional type guard cannot be used as base';

/**
 * Extract values based on provided type guard and default value
 * @template {TypeGuard<any>} T
 * @param {NotOptionalTypeGuard<T>} type
 * @param {InferTypeGuard<T>} initial
 * @returns {TransformFunction<InferTypeGuard<T>>}
 */
const getType = (type, initial) => {

	const { classification } = getTypeGuardMeta(type);

	// Check for invalid optional type guard
	if (classification === 'optional') {
		throw TypeError(invalidBaseTypeGuard);
	}

	// Check for default value to be of a valid type
	if (!type(initial)) {
		throw TypeError(invalidInitialValue(type, initial));
	}

	return (value) => {

		// Check for valid value type
		if (type(value)) {
			return pickValue(value, type);
		}

		return pickValue(initial, type);
	};
};

module.exports = {
	getType
};