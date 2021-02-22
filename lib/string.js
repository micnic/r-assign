'use strict';

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
 * @returns {(value: any) => string}
 */
const useString = (initial = '') => {

	// Check for default value to be a string
	if (!isString(initial)) {
		throw TypeError(invalidDefaultValue);
	}

	/**
	 * Transform function for string values
	 * @param {any} value
	 * @returns {string}
	 */
	const result = (value) => {

		// Just return string values
		if (isString(value)) {
			return value;
		}

		return initial;
	};

	return result;
};

module.exports = {
	isString,
	useString
};