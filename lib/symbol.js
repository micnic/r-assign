'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

const invalidDefaultValue = 'Invalid default value, symbol expected';

/**
 * Check for symbol values
 * @param {any} value
 * @returns {value is symbol}
 */
const isSymbol = (value) => {

	return (typeof value === 'symbol');
};

/**
 * Creator of transform functions for symbol values
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
 * Transform function to validate symbol values
 * @type {TransformFunction<symbol>}
 */
const parseSymbol = (value, key) => {

	// Check for symbol values to validate them
	if (!isSymbol(value)) {
		throw new TypeError(`Property ${key} is expected to be a symbol`);
	}

	return value;
};

module.exports = {
	getSymbol,
	isSymbol,
	parseSymbol
};