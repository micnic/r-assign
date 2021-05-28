'use strict';

const {
	setTypeGuardMeta
} = require('r-assign/lib/common');

/**
 * @typedef {import('r-assign').TransformFunction} TransformFunction
 */

/**
 * @typedef {import('r-assign/lib').TypeGuard} TypeGuard
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
 * @type {TransformFunction}
 */
const getAny = (value) => {

	return value;
};

/**
 * Extract and validate any values
 * @type {TransformFunction}
 */
const parseAny = getAny;

module.exports = {
	getAny,
	isAny,
	parseAny
};