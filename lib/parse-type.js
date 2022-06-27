'use strict';

const { invalidValue } = require('r-assign/lib/internal/invalid-type');
const { replaceValue } = require('r-assign/lib/internal/pick-value');
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
 * @typedef {import('r-assign/lib').RF<T>} ReplaceFunction
 */

const invalidBaseTypeGuard = 'Optional type guard cannot be used as base';

/**
 * Extract and validate values based on the provided type guard
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {NotOptionalTypeGuard<T>} type
 * @param {ReplaceFunction<InferTypeGuard<T>>} [replace]
 * @returns {TransformFunction<InferTypeGuard<T>>}
 */
const parseType = (type, replace) => {

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

		return replaceValue(value, type, replace);
	};
};

module.exports = { parseType };