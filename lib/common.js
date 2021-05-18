'use strict';

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const invalidTypeGuard = 'Invalid type guard provided';
const invalidTypeGuardReturn = 'Invalid return value of type guard';

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @param {string} [expected]
 * @returns {string}
 */
const invalidPropertyType = (key, expected) => {

	const message = `Property "${key}" has invalid type`;

	// Check for provided expected type
	if (typeof expected !== 'undefined') {
		return `${message}, expected ${expected}`;
	}

	return message;
};

/**
 * Validate the provided type guard
 * @template {TypeGuard<any>} T
 * @param {T} type
 */
const validateTypeGuard = (type) => {

	// Check for valid type guard
	if (typeof type !== 'function') {
		throw new TypeError(invalidTypeGuard);
	}

	// Check for valid return value of type guard
	if (typeof type() !== 'boolean') {
		throw new TypeError(invalidTypeGuardReturn);
	}
};

module.exports = {
	invalidPropertyType,
	validateTypeGuard
};