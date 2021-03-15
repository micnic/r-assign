'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/union').TypeGuard<T>} TypeGuard
 */

const { isFinite } = Number;

const invalidDefaultValue = 'Invalid default value, finite number expected';

/**
 * Check for finite number values
 * @type {TypeGuard<number>}
 */
const isNumber = (value) => {

	return (typeof value === 'number' && isFinite(value));
};

/**
 * Creator of transform functions for finite number values
 * @param {number} [initial]
 * @returns {TransformFunction<number>}
 */
const getNumber = (initial = 0) => {

	// Check for default value to be a number
	if (!isNumber(initial)) {
		throw TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Just return number values
		if (isNumber(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Transform function to validate number values
 * @type {TransformFunction<number>}
 */
const parseNumber = (value, key) => {

	// Check for number values to validate them
	if (!isNumber(value)) {
		throw new TypeError(`Property ${key} is expected to be a number`);
	}

	return value;
};

module.exports = {
	getNumber,
	isNumber,
	parseNumber
};