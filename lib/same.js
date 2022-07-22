'use strict';

const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 *
 * @template {TypeGuard<Record<keyof any, any> | any[]>} T
 * @param {T} type
 * @param {boolean} [same]
 * @returns {T}
 */
const setSame = (type, same = true) => {

	const meta = getTypeGuardMeta(type);
	const { classification } = meta;

	switch (classification) {

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
			throw new TypeError(`Invalid type guard classification: ${classification}`);
		}
	}
};

module.exports = {
	same: setSame,
	setSame
};