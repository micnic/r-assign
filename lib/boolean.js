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
 * Check for boolean values
 * @type {TypeGuard<boolean>}
 */
const isBoolean = (value) => (typeof value === 'boolean');

// Save type guard meta
setTypeGuardMeta(isBoolean, {
	annotation: 'boolean',
	classification: 'primitive',
	description: 'a boolean value',
	primitive: 'boolean'
});

/**
 * Extract boolean values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @param {boolean} [initial]
 * @returns {TransformFunction<boolean>}
 */
const getBoolean = (initial = false) => getType(isBoolean, initial);

/**
 * Extract and validate boolean values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<boolean>}
 */
const parseBoolean = parseType(isBoolean);

module.exports = {
	boolean: isBoolean,
	getBoolean,
	isBoolean,
	parseBoolean
};