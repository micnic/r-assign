'use strict';

const {
	invalidInitialValue,
	invalidValue
} = require('r-assign/lib/internal/invalid-type');
const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * Check for symbol values
 * @type {TypeGuard<symbol>}
 */
const isSymbol = (value) => (typeof value === 'symbol');

// Save type guard meta
setTypeGuardMeta(isSymbol, {
	annotation: 'symbol',
	classification: 'primitive',
	description: 'a symbol value',
	main: isSymbol,
	primitive: 'symbol'
});

/**
 * Extract symbol values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @param {symbol} [initial]
 * @returns {TransformFunction<symbol>}
 */
const getSymbol = (initial = Symbol()) => {

	// Check for default value to be a symbol
	if (!isSymbol(initial)) {
		throw TypeError(invalidInitialValue(isSymbol, initial));
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
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<symbol>}
 */
const parseSymbol = (value, key) => {

	// Check for symbol values to validate them
	if (!isSymbol(value)) {
		throw TypeError(invalidValue(isSymbol, value, key));
	}

	return value;
};

module.exports = {
	getSymbol,
	isSymbol,
	parseSymbol,
	symbol: isSymbol
};