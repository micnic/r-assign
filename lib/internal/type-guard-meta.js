'use strict';

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib').ATG} AnyTypeGuard
 */

/**
 * @typedef {import('r-assign/lib/internal').TC} TypeClassification
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
 * Assert for base type guards
 * @param {TypeClassification} classification
 */
const assertBaseTypeGuard = (classification) => {

	// Check for optional type
	if (classification === 'optional') {
		throw TypeError('Invalid use of optional type');
	}

	// Check for rest type
	if (classification === 'rest') {
		throw TypeError('Invalid use of tuple rest');
	}
};

/**
 * Check for any type guard
 * @param {TypeGuard} type
 * @returns {type is AnyTypeGuard}
 */
const isAnyTypeGuard = (type) => (
	getTypeGuardMeta(type).classification === 'any'
);

/**
 * Check for key type guard
 * @param {TypeGuard} type
 * @returns {type is TypeGuard<keyof any>}
 */
const isKeyTypeGuard = (type) => {

	const meta = getTypeGuardMeta(type);

	// Switch on type classification
	switch (meta.classification) {

		case 'literal':
		case 'literals':
		case 'template-literal': {
			return true;
		}

		case 'primitive': {
			return (
				(meta.primitive === 'number' && meta.finite) ||
				meta.primitive === 'string' ||
				meta.primitive === 'symbol'
			);
		}

		case 'union': {
			return meta.union.every(isKeyTypeGuard);
		}

		default: {
			return false;
		}
	}
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
	assertBaseTypeGuard,
	getTypeGuardMeta,
	isAnyTypeGuard,
	isKeyTypeGuard,
	isStringTypeGuard,
	setTypeGuardMeta
};