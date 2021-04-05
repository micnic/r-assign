'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferIntersection<T>} InferIntersection
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').Intersection<T>} Intersection
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
 * Check for values of intersection types
 * @template {Intersection<any>} I
 * @param {I} intersection
 * @returns {TypeGuard<InferIntersection<I>>}
 */
const isIntersectionOf = (intersection) => {

	// Check for valid types provided
	if (!isArray(intersection)) {
		throw new TypeError(invalidTypeChecks);
	}

	// Check for less than two type checks
	if (intersection.length <= 1) {
		throw new TypeError(notEnoughTypeChecks);
	}

	// Validate each type checker
	intersection.forEach((type) => {

		// Check for valid type check
		if (typeof type !== 'function') {
			throw new TypeError(invalidTypeCheck);
		}

		// Check for valid return value of type check
		if (typeof type() !== 'boolean') {
			throw new TypeError(invalidTypeCheckReturn);
		}
	});

	/** @type {TypeGuard<InferIntersection<I>>} */
	const result = (value) => intersection.every((type) => type(value));

	return result;
};

/**
 * Creator of transform functions for union types values
 * @template {Intersection<any>} I
 * @param {I} intersection
 * @param {InferIntersection<I>} initial
 * @returns {TransformFunction<InferIntersection<I>>}
 */
const getIntersectionOf = (intersection, initial) => {

	const check = isIntersectionOf(intersection);

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
 * @template {Intersection<any>} I
 * @param {I} intersection
 * @returns {TransformFunction<InferIntersection<I>>}
 */
const parseIntersectionOf = (intersection) => {

	const check = isIntersectionOf(intersection);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key));
		}

		return value;
	};
};

module.exports = {
	getIntersectionOf,
	isIntersectionOf,
	parseIntersectionOf
};