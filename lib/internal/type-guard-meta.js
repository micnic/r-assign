/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign').ATG} AnyTypeGuard
 */

/**
 * @typedef {import('./index.js').TC} TypeClassification
 */

/**
 * @typedef {import('./index.js').TGM} TypeGuardMeta
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
export const getTypeGuardMeta = (type) => {

	const meta = typeGuardMeta.get(type);

	// Validate type guard meta
	if (!meta) {
		throw TypeError(invalidTypeGuard);
	}

	return meta;
};

/**
 * Extract type guard meta that may be void
 * @param {TypeGuard | undefined} type
 * @returns {TypeGuardMeta}
 */
export const getVoidableTypeGuardMeta = (type) => {

	// Check for void type
	if (type === undefined) {
		return {
			annotation: 'void',
			classification: 'void',
			description: 'void'
		};
	}

	return getTypeGuardMeta(type);
};

/**
 * Assert for base type guards
 * @param {TypeClassification} classification
 */
export const assertBaseTypeGuard = (classification) => {

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
export const isAnyTypeGuard = (type) => (
	getTypeGuardMeta(type).classification === 'any'
);

/**
 * Check for key type guard
 * @param {TypeGuard} type
 * @returns {type is TypeGuard<keyof any>}
 */
export const isKeyTypeGuard = (type) => {

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
export const isStringTypeGuard = (type) => {

	const meta = getTypeGuardMeta(type);

	return (meta.classification === 'primitive' && meta.primitive === 'string');
};

/**
 * Save type guard meta
 * @param {TypeGuard} type
 * @param {TypeGuardMeta} meta
 */
export const setTypeGuardMeta = (type, meta) => {
	typeGuardMeta.set(type, meta);
};