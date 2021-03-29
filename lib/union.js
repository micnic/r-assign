'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').ExtractTypeGuard<T>} ExtractTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferUnion<T>} InferUnion
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').Union<T>} Union
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
 * @template {Union<any>} U
 * @param {U} union
 * @returns {TypeGuard<InferUnion<U>>}
 */
const isUnionOf = (union) => {

	// Check for valid types provided
	if (!isArray(union)) {
		throw new TypeError(invalidTypeChecks);
	}

	// Check for less than two type checks
	if (union.length <= 1) {
		throw new TypeError(notEnoughTypeChecks);
	}

	// Validate each type checker
	union.forEach((type) => {

		// Check for valid type check
		if (typeof type !== 'function') {
			throw new TypeError(invalidTypeCheck);
		}

		// Check for valid return value of type check
		if (typeof type() !== 'boolean') {
			throw new TypeError(invalidTypeCheckReturn);
		}
	});

	/** @type {TypeGuard<InferUnion<U>>} */
	const result = (value) => union.some((type) => type(value));

	return result;
};

/**
 * Creator of transform functions for union types values
 * @template {Union<any>} U
 * @param {U} union
 * @param {InferUnion<U>} initial
 * @returns {TransformFunction<InferUnion<U>>}
 */
const getUnionOf = (union, initial) => {

	const check = isUnionOf(union);

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
 * @template {Union<any>} U
 * @param {U} union
 * @returns {TransformFunction<InferUnion<U>>}
 */
const parseUnionOf = (union) => {

	const check = isUnionOf(union);

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