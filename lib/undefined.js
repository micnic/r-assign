'use strict';

const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template T
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * Check for undefined values
 * @type {TypeGuard<undefined>}
 */
const isUndefined = (value) => {

	return (typeof value === 'undefined');
};

// Save type guard meta
setTypeGuardMeta(isUndefined, {
	annotation: 'undefined',
	classification: 'literal',
	description: 'an undefined value'
});

module.exports = {
	isUndefined
};