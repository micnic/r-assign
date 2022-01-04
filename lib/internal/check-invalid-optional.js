'use strict';

const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');


/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * Check for invalid optional value
 * @param {TypeGuard} type
 * @param {any} property
 * @returns {boolean}
 */
const checkInvalidOptional = (type, property) => {

	const meta = getTypeGuardMeta(type);
	const { classification } = meta;

	// Check for optional type
	if (classification === 'optional') {

		// Check for undefined value
		if (property === undefined) {
			return !meta.undef;
		}

		return !meta.type(property);
	}

	return false;
};

module.exports = { checkInvalidOptional };