'use strict';

const { getType } = require('r-assign/lib/get-type');
const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');
const { parseType } = require('r-assign/lib/parse-type');

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
	primitive: 'symbol'
});

/**
 * Extract symbol values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @param {symbol} [initial]
 * @returns {TransformFunction<symbol>}
 */
const getSymbol = (initial = Symbol()) => getType(isSymbol, initial);

/**
 * Extract and validate symbol values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<symbol>}
 */
const parseSymbol = parseType(isSymbol);

module.exports = {
	getSymbol,
	isSymbol,
	parseSymbol,
	symbol: isSymbol
};