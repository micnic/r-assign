'use strict';

const invalidDefaultValue = 'Invalid default value, number expected';

/**
 * Creator of transform functions for number values
 * @param {number} [initial]
 * @returns {(value: any) => number}
 */
const useNumber = (initial = 0) => {

	// Check for default value to be a number
	if (typeof initial !== 'number') {
		throw TypeError(invalidDefaultValue);
	}

	/**
	 * Transform function for number values
	 * @param {any} value
	 * @returns {number}
	 */
	const result = (value) => {

		// Just return number values
		if (typeof value === 'number') {
			return value;
		}

		return initial;
	};

	return result;
};

module.exports = useNumber;