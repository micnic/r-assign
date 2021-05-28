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

/**
 * Check for symbol values
 * @type {TypeGuard<symbol>}
 */
const isSymbol = (value) => {

	return (typeof value === 'symbol');
};

// Save type guard meta
setTypeGuardMeta(isSymbol, {
	annotation: 'symbol',
	classification: 'primitive',
	description: 'a symbol value'
});

/**
 * Extract symbol values
 * @param {symbol} [initial]
 * @returns {TransformFunction<symbol>}
 */
const getSymbol = (initial = Symbol()) => {

	// Check for default value to be a symbol
	if (!isSymbol(initial)) {
		throw TypeError(invalidPropertyType(isSymbol, true, initial));
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
		throw TypeError(invalidPropertyType(isSymbol, false, value, key));
	}

	return value;
};

module.exports = {
	getSymbol,
	isSymbol,
	parseSymbol
};