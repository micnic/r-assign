'use strict';

const { invalidValue } = require('r-assign/lib/internal/invalid-type');
const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

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

const invalidBaseTypeGuard = 'Optional type guard cannot be used as base';

/**
 * Asserts that the provided value is of the provided type
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {TypeGuard} T
 * @param {NotOptionalTypeGuard<T>} type
 * @param {unknown} value
 * @returns {asserts value is InferTypeGuard<T>}
 */
const assertType = (type, value) => {

	const { classification } = getTypeGuardMeta(type);

	// Check for invalid optional type guard
	if (classification === 'optional') {
		throw TypeError(invalidBaseTypeGuard);
	}

	// Check for default value to be of a valid type
	if (!type(value)) {
		throw TypeError(invalidValue(type, value));
	}
};

module.exports = { assertType };