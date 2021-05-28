'use strict';

const {
	invalidPropertyType,
	setTypeGuardMeta
} = require('r-assign/lib/common');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const { isFinite } = Number;

/**
 * Check for number values
 * @type {TypeGuard<number>}
 */
const isAnyNumber = (value) => {

	return (typeof value === 'number');
};

// Save type guard meta
setTypeGuardMeta(isAnyNumber, {
	annotation: 'number',
	classification: 'primitive',
	description: 'a number value'
});

/**
 * Check for finite number values
 * @type {TypeGuard<number>}
 */
const isNumber = (value) => {

	return (isAnyNumber(value) && isFinite(value));
};

// Save type guard meta
setTypeGuardMeta(isNumber, {
	annotation: 'number',
	classification: 'primitive',
	description: 'a finite number value'
});

/**
 * Extract number values
 * @param {number} [initial]
 * @returns {TransformFunction<number>}
 */
const getAnyNumber = (initial = 0) => {

	// Check for default value to be a number
	if (!isAnyNumber(initial)) {
		throw TypeError(invalidPropertyType(isAnyNumber, true, initial));
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
		throw TypeError(invalidPropertyType(isNumber, true, initial));
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
		throw TypeError(invalidPropertyType(isAnyNumber, false, value, key));
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
		throw TypeError(invalidPropertyType(isNumber, false, value, key));
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