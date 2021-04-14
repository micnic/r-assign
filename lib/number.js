'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const { isFinite } = Number;

const finiteNumber = 'finite number';
const finiteNumberExpected = 'Invalid default value, finite number expected';
const number = 'number';
const numberExpected = 'Invalid default value, number expected';

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @param {string} type
 * @returns {string}
 */
const invalidPropertyType = (key, type) => {
	return `Property ${key} is expected to be a ${type}`;
};

/**
 * Check for number values
 * @type {TypeGuard<number>}
 */
const isAnyNumber = (value) => {

	return (typeof value === 'number');
};

/**
 * Check for finite number values
 * @type {TypeGuard<number>}
 */
const isNumber = (value) => {

	return (isAnyNumber(value) && isFinite(value));
};

/**
 * Extract number values
 * @param {number} [initial]
 * @returns {TransformFunction<number>}
 */
const getAnyNumber = (initial = 0) => {

	// Check for default value to be a number
	if (!isAnyNumber(initial)) {
		throw TypeError(numberExpected);
	}

	return (value) => {

		// Just return number values
		if (isAnyNumber(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Extract finite number values
 * @param {number} [initial]
 * @returns {TransformFunction<number>}
 */
const getNumber = (initial = 0) => {

	// Check for default value to be a number
	if (!isNumber(initial)) {
		throw TypeError(finiteNumberExpected);
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
 * Extract and validate number values
 * @type {TransformFunction<number>}
 */
const parseAnyNumber = (value, key) => {

	// Check for number values to validate them
	if (!isAnyNumber(value)) {
		throw new TypeError(invalidPropertyType(key, number));
	}

	return value;
};

/**
 * Extract and validate finite number values
 * @type {TransformFunction<number>}
 */
const parseNumber = (value, key) => {

	// Check for number values to validate them
	if (!isNumber(value)) {
		throw new TypeError(invalidPropertyType(key, finiteNumber));
	}

	return value;
};

module.exports = {
	getAnyNumber,
	getNumber,
	isAnyNumber,
	isNumber,
	parseAnyNumber,
	parseNumber
};