'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

const invalidDefaultValue = 'Invalid default value, string expected';

/**
 * Check for string values
 * @param {any} value
 * @returns {value is string}
 */
const isString = (value) => {

	return (typeof value === 'string');
};

/**
 * Creator of transform functions for string values
 * @param {string} [initial]
 * @returns {TransformFunction<string>}
 */
const useString = (initial = '') => {

	// Check for default value to be a string
	if (!isString(initial)) {
		throw TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Just return string values
		if (isString(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Transform function to validate string values
 * @type {TransformFunction<string>}
 */
const validateString = (value, key) => {

	// Check for string values to validate them
	if (!isString(value)) {
		throw new TypeError(`Property ${key} is expected to be a string`);
	}

	return value;
};

module.exports = {
	isString,
	useString,
	validateString
};