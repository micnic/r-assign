'use strict';

const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/** @type {TypeGuard<never>} */
const isNever = () => false;

// Save type guard meta
setTypeGuardMeta(isNever, {
	annotation: 'never',
	classification: 'never',
	description: 'never'
});

module.exports = {
	isNever,
	never: isNever
};