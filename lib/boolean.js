'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

const invalidDefaultValue = 'Invalid default value, boolean expected';

/**
 * Check for boolean values
 * @param {any} value
 * @returns {value is boolean}
 */
const isBoolean = (value) => {

	return (typeof value === 'boolean');
};

/**
 * Creator of transform functions for boolean values
 * @param {boolean} [initial]
 * @returns {TransformFunction<boolean>}
 */
const useBoolean = (initial = false) => {

	// Check for default value to be a boolean
	if (!isBoolean(initial)) {
		throw TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Just return boolean values
		if (isBoolean(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Transform function to validate boolean values
 * @type {TransformFunction<boolean>}
 */
const validateBoolean = (value, key) => {

	// Check for boolean values to validate them
	if (!isBoolean(value)) {
		throw new TypeError(`Property ${key} is expected to be a boolean`);
	}

	return value;
};

module.exports = {
	isBoolean,
	useBoolean,
	validateBoolean
};