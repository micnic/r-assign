'use strict';

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib/internal').TGM} TypeGuardMeta
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
 * Check for string type guard
 * @param {TypeGuard} type
 * @returns {type is TypeGuard<string>}
 */
const isStringTypeGuard = (type) => {

	const meta = getTypeGuardMeta(type);

	return (meta.classification === 'primitive' && meta.primitive === 'string');
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
	isStringTypeGuard,
	setTypeGuardMeta
};