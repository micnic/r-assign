'use strict';

const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

const allowedTypes = 'are allowed only array, object, record or tuple types';
const invalidSetSame = `Invalid type for "setSame()", ${allowedTypes}`;

/**
 * Set same flag for the provided type guard
 * @template {TypeGuard<Record<keyof any, any> | any[]>} T
 * @param {T} type
 * @param {boolean} [same]
 * @returns {T}
 */
const setSame = (type, same = true) => {

	const meta = getTypeGuardMeta(type);

	// Switch on type classification
	switch (meta.classification) {

		case 'array':
		case 'object':
		case 'record':
		case 'tuple': {

			// Set same flag in type guard meta
			setTypeGuardMeta(type, {
				...meta,
				same
			});

			return type;
		}

		default: {
			throw TypeError(invalidSetSame);
		}
	}
};

module.exports = {
	same: setSame,
	setSame
};