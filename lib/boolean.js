'use strict';

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
 * @returns {(value: any) => boolean}
 */
const useBoolean = (initial = false) => {

	// Check for default value to be a boolean
	if (!isBoolean(initial)) {
		throw TypeError(invalidDefaultValue);
	}

	/**
	 * Transform function for boolean values
	 * @param {any} value
	 * @returns {boolean}
	 */
	const result = (value) => {

		// Just return boolean values
		if (isBoolean(value)) {
			return value;
		}

		return initial;
	};

	return result;
};

module.exports = {
	isBoolean,
	useBoolean
};