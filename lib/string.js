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
 * Check for string values
 * @type {TypeGuard<string>}
 */
const isString = (value) => (typeof value === 'string');

// Save type guard meta
setTypeGuardMeta(isString, {
	annotation: 'string',
	classification: 'primitive',
	description: 'a string value',
	primitive: 'string'
});

/**
 * Transform any value to string
 * @deprecated will be removed in version 2.0, use "asString()" instead
 * @type {TransformFunction<string>}
 */
const convertToString = (value) => {

	// Check for string values
	if (isString(value)) {
		return value;
	}

	return String(value);
};

/**
 * Extract string values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @param {string} [initial]
 * @returns {TransformFunction<string>}
 */
const getString = (initial = '') => getType(isString, initial);

/**
 * Extract and validate string values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<string>}
 */
const parseString = parseType(isString);

module.exports = {
	asString: convertToString,
	convertToString,
	getString,
	isString,
	parseString,
	string: isString
};