'use strict';

const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @typedef {import('r-assign').TransformFunction} TransformFunction
 */

/**
 * @typedef {import('r-assign/lib').TG} TypeGuard
 */

/**
 * Check for any values
 * @type {TypeGuard}
 */
const isAny = () => {

	return true;
};

// Save type guard meta
setTypeGuardMeta(isAny, {
	annotation: 'any',
	classification: 'any',
	description: 'any value'
});

/**
 * Extract any values
 * @deprecated will be removed in version 2.0, use getType instead
 * @type {TransformFunction}
 */
const getAny = (value) => {

	return value;
};

/**
 * Extract and validate any values
 * @deprecated will be removed in version 2.0, use parseType instead
 * @type {TransformFunction}
 */
const parseAny = getAny;

module.exports = {
	getAny,
	isAny,
	parseAny
};