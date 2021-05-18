'use strict';

const {
	invalidPropertyType,
	validateTypeGuard
} = require('r-assign/lib/common');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferIntersection<T>} InferIntersection
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').Intersection<T>} Intersection
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const { isArray } = Array;

const invalidDefaultValue = 'Invalid default value';
const invalidTypeGuards = 'Invalid type guards provided';
const notEnoughTypeGuards = 'Not enough type guards, at least two expected';

/**
 * Check for intersection type values
 * @template {Intersection<any>} I
 * @param {I} intersection
 * @returns {TypeGuard<InferIntersection<I>>}
 */
const isIntersectionOf = (intersection) => {

	// Check for valid types provided
	if (!isArray(intersection)) {
		throw new TypeError(invalidTypeGuards);
	}

	// Check for less than two type guards
	if (intersection.length <= 1) {
		throw new TypeError(notEnoughTypeGuards);
	}

	// Validate each type guard
	for (const type of intersection) {
		validateTypeGuard(type);
	}

	/** @type {TypeGuard<InferIntersection<I>>} */
	const result = (value) => {

		// Check value with every type guard from the intersection
		for (const type of intersection) {
			if (!type(value)) {
				return false;
			}
		}

		return true;
	};

	return result;
};

/**
 * Extract intersection type values
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
 * Extract and validate intersection type values
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