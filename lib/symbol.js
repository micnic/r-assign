'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const invalidDefaultValue = 'Invalid default value, symbol expected';

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @returns {string}
 */
const invalidPropertyType = (key) => {
	return `Property "${key}" is expected to be a symbol`;
};

/**
 * Check for symbol values
 * @type {TypeGuard<symbol>}
 */
const isSymbol = (value) => {

	return (typeof value === 'symbol');
};

/**
 * Extract symbol values
 * @param {symbol} [initial]
 * @returns {TransformFunction<symbol>}
 */
const getSymbol = (initial = Symbol()) => {

	// Check for default value to be a symbol
	if (!isSymbol(initial)) {
		throw TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Just return symbol values
		if (isSymbol(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Extract and validate symbol values
 * @type {TransformFunction<symbol>}
 */
const parseSymbol = (value, key) => {

	// Check for symbol values to validate them
	if (!isSymbol(value)) {
		throw new TypeError(invalidPropertyType(key));
	}

	return value;
};

module.exports = {
	getSymbol,
	isSymbol,
	parseSymbol
};