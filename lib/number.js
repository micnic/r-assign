'use strict';

const { isFinite } = Number;

const invalidDefaultValue = 'Invalid default value, finite number expected';

/**
 * Check for finite number values
 * @param {any} value
 * @returns {value is number}
 */
const isNumber = (value) => {

	return (typeof value === 'number' && isFinite(value));
};

/**
 * Creator of transform functions for finite number values
 * @param {number} [initial]
 * @returns {(value: any) => number}
 */
const useNumber = (initial = 0) => {

	// Check for default value to be a number
	if (!isNumber(initial)) {
		throw TypeError(invalidDefaultValue);
	}

	/**
	 * Transform function for number values
	 * @param {any} value
	 * @returns {number}
	 */
	const result = (value) => {

		// Just return number values
		if (isNumber(value)) {
			return value;
		}

		return initial;
	};

	return result;
};

module.exports = {
	isNumber,
	useNumber
};