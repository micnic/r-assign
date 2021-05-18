'use strict';

const {
	invalidPropertyType,
	validateTypeGuard
} = require('r-assign/lib/common');

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
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const { isArray } = Array;

const invalidDefaultValue = 'Invalid default value';

/**
 * Check for array values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TypeGuard<InferTypeGuard<T>[]>}
 */
const isArrayOf = (type) => {

	// Validate the provided type guard
	validateTypeGuard(type);

	/** @type {TypeGuard<InferTypeGuard<T>[]>} */
	const result = (value) => {

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

	return result;
};

/**
 * Extract array values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @param {InferTypeGuard<T>[]} [initial]
 * @returns {TransformFunction<InferTypeGuard<T>[]>}
 */
const getArrayOf = (type, initial = []) => {

	const check = isArrayOf(type);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw new TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return [ ...value ];
		}

		return [ ...initial ];
	};
};

/**
 * Extract and validate array values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TransformFunction<InferTypeGuard<T>[]>}
 */
const parseArrayOf = (type) => {

	const check = isArrayOf(type);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key));
		}

		return [ ...value ];
	};
};

module.exports = {
	getArrayOf,
	isArrayOf,
	parseArrayOf
};