'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/union').ExtractTypeGuard<T>} ExtractTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/union').TypeGuard<T>} TypeGuard
 */

const { isArray } = Array;

const invalidDefaultValue = 'Invalid default value';
const invalidTypeCheck = 'Invalid type check provided';
const invalidTypeCheckReturn = 'Invalid return value of type check';
const invalidTypeChecks = 'Invalid type checks provided';
const notEnoughTypeChecks = 'Not enough type checks, at least two expected';

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @returns {string}
 */
const invalidPropertyType = (key) => {
	return `Property ${key} has invalid type`;
};

/**
 * Check for values of union types
 * @template {TypeGuard<any>} T
 * @param {T[]} types
 * @returns {TypeGuard<ExtractTypeGuard<T>>}
 */
const isUnionOf = (types) => {

	// Check for valid types provided
	if (!isArray(types)) {
		throw new TypeError(invalidTypeChecks);
	}

	// Check for less than two type checks
	if (types.length <= 1) {
		throw new TypeError(notEnoughTypeChecks);
	}

	// Validate each type checker
	types.forEach((type) => {

		// Check for valid type check
		if (typeof type !== 'function') {
			throw new TypeError(invalidTypeCheck);
		}

		// Check for valid return value of type check
		if (typeof type() !== 'boolean') {
			throw new TypeError(invalidTypeCheckReturn);
		}
	});

	/** @type {TypeGuard<ExtractTypeGuard<T>>} */
	const result = (value) => types.some((type) => type(value));

	return result;
};

/**
 * Creator of transform functions for union types values
 * @template {TypeGuard<any>} T
 * @param {T[]} types
 * @param {ExtractTypeGuard<T>} initial
 * @returns {TransformFunction<ExtractTypeGuard<T>>}
 */
const getUnionOf = (types, initial) => {

	const check = isUnionOf(types);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw new TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Creator of transform functions for validating union types
 * @template {TypeGuard<any>} T
 * @param {T[]} types
 * @returns {TransformFunction<ExtractTypeGuard<T>>}
 */
const parseUnionOf = (types) => {

	const check = isUnionOf(types);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key));
		}

		return value;
	};
};

module.exports = {
	getUnionOf,
	isUnionOf,
	parseUnionOf
};