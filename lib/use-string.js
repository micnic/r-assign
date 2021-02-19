'use strict';

const invalidDefaultValue = 'Invalid default value, string expected';

/**
 * Creator of transform functions for string values
 * @param {string} [initial]
 * @returns {(value: any) => string}
 */
const useString = (initial = '') => {

	// Check for default value to be a string
	if (typeof initial !== 'string') {
		throw TypeError(invalidDefaultValue);
	}

	/**
	 * Transform function for string values
	 * @param {any} value
	 * @returns {string}
	 */
	const result = (value) => {

		// Just return string values
		if (typeof value === 'string') {
			return value;
		}

		return initial;
	};

	return result;
};

module.exports = useString;