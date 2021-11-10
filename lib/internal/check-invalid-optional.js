'use strict';

const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');


/**
 * @template T
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * Check for invalid optional value
 * @param {TypeGuard<any>} type
 * @param {any} property
 * @returns {boolean}
 */
const checkInvalidOptional = (type, property) => {

	const meta = getTypeGuardMeta(type);
	const { classification } = meta;

	return (classification === 'optional' && !meta.type(property));
};

module.exports = { checkInvalidOptional };