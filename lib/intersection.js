'use strict';

const {
	invalidInitialValue,
	invalidOptionalType,
	invalidValue
} = require('r-assign/lib/internal/invalid-type');
const { pickIntersection } = require('r-assign/lib/internal/pick-value');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template I
 * @typedef {import('r-assign/lib').InferIntersection<I>} InferIntersection
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Intersection} Intersection
 */

const { isArray } = Array;

const anyIntersection = 'Provided intersection of any';
const impossibleIntersection = 'Provided intersection is impossible';
const invalidTypeGuards = 'Invalid type guards provided';
const notEnoughTypeGuards = 'Not enough type guards, at least two expected';

/**
 * Get intersection annotation
 * @template {Intersection} I
 * @param {I} intersection
 * @returns {string}
 */
const getIntersectionAnnotation = (intersection) => {

	/** @type {string[]} */
	const annotations = [];

	// Loop over all type guards
	for (const type of intersection) {

		const { annotation, classification } = getTypeGuardMeta(type);

		// Check for any type
		if (classification === 'any') {
			throw TypeError(anyIntersection);
		}

		// Check for literal and primitive types
		if (classification === 'literal' || classification === 'primitive') {
			throw TypeError(impossibleIntersection);
		}

		// Check for optional type
		if (classification === 'optional') {
			throw TypeError(invalidOptionalType('intersection'));
		}

		// Add annotation to the list
		annotations.push(annotation);
	}

	return `(${annotations.join(' & ')})`;
};

/**
 * Check for intersection type values
 * @template {Intersection} I
 * @param {I} intersection
 * @returns {TypeGuard<InferIntersection<I>>}
 */
const isIntersectionOf = (intersection) => {

	// Check for valid types provided
	if (!isArray(intersection)) {
		throw TypeError(invalidTypeGuards);
	}

	// Check for less than two type guards
	if (intersection.length <= 1) {
		throw TypeError(notEnoughTypeGuards);
	}

	const annotation = getIntersectionAnnotation(intersection);

	/** @type {TypeGuard<InferIntersection<I>>} */
	const check = (value) => {

		// Check value with every type guard from the intersection
		for (const type of intersection) {
			if (!type(value)) {
				return false;
			}
		}

		return true;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'intersection',
		description: `an intersection of ${annotation}`,
		types: intersection
	});

	return check;
};

/**
 * Extract intersection type values
 * @deprecated will be removed in version 2.0, use getType instead
 * @template {Intersection} I
 * @param {I} intersection
 * @param {InferIntersection<I>} initial
 * @returns {TransformFunction<InferIntersection<I>>}
 */
const getIntersectionOf = (intersection, initial) => {

	const check = isIntersectionOf(intersection);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw TypeError(invalidInitialValue(check, initial));
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return pickIntersection(value, intersection);
		}

		return pickIntersection(initial, intersection);
	};
};

/**
 * Extract and validate intersection type values
 * @deprecated will be removed in version 2.0, use parseType instead
 * @template {Intersection} I
 * @param {I} intersection
 * @returns {TransformFunction<InferIntersection<I>>}
 */
const parseIntersectionOf = (intersection) => {

	const check = isIntersectionOf(intersection);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidValue(check, value, key));
		}

		return pickIntersection(value, intersection);
	};
};

module.exports = {
	getIntersectionOf,
	isIntersectionOf,
	parseIntersectionOf
};