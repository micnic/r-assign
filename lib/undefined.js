'use strict';

const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * Check for undefined values
 * @type {TypeGuard<undefined>}
 */
const isUndefined = (value) => (value === undefined);

// Save type guard meta
setTypeGuardMeta(isUndefined, {
	annotation: 'undefined',
	classification: 'literal',
	description: 'an undefined value',
	literal: undefined
});

module.exports = {
	isUndefined,
	undef: isUndefined
};