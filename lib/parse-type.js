'use strict';

const { invalidValue } = require('r-assign/lib/internal/invalid-type');
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
 * Extract and validate values based on the provided type guard
 * @template {TypeGuard<any>} T
 * @param {NotOptionalTypeGuard<T>} type
 * @returns {TransformFunction<InferTypeGuard<T>>}
 */
const parseType = (type) => {

	const { classification } = getTypeGuardMeta(type);

	// Check for invalid optional type guard
	if (classification === 'optional') {
		throw TypeError(invalidBaseTypeGuard);
	}

	return (value, key) => {

		// Throw for invalid value type
		if (!type(value)) {
			throw TypeError(invalidValue(type, value, key));
		}

		return pickValue(value, type);
	};
};

module.exports = {
	parseType
};