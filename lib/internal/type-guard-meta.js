'use strict';

/**
 * @typedef {import('r-assign/lib').TG} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib/internal').TypeGuardMeta} TypeGuardMeta
 */

const invalidTypeGuard = 'Invalid type guard provided';

/**
 * @type {WeakMap<TypeGuard, TypeGuardMeta>}
 */
const typeGuardMeta = new WeakMap();

/**
 * Extract type guard meta
 * @param {TypeGuard} type
 * @returns {TypeGuardMeta}
 */
const getTypeGuardMeta = (type) => {

	const meta = typeGuardMeta.get(type);

	// Validate type guard meta
	if (!meta) {
		throw TypeError(invalidTypeGuard);
	}

	return meta;
};

/**
 * Save type guard meta
 * @param {TypeGuard} type
 * @param {TypeGuardMeta} meta
 */
const setTypeGuardMeta = (type, meta) => {
	typeGuardMeta.set(type, meta);
};

module.exports = {
	getTypeGuardMeta,
	setTypeGuardMeta
};