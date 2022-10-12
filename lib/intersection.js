'use strict';

const { getType } = require('r-assign/lib/get-type');
const {
	hasAtLeastTwoElements,
	hasTwoElements
} = require('r-assign/lib/internal/array-checks');
const { invalidOptionalType } = require('r-assign/lib/internal/invalid-type');
const {
	getTypeGuardMeta,
	isAnyTypeGuard,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
const { isAny } = require('r-assign/lib/any');
const { parseType } = require('r-assign/lib/parse-type');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Intersection} Intersection
 */

/**
 * @template {Intersection} I
 * @typedef {import('r-assign/lib').InferInt<I>} InferIntersection
 */

const { isArray } = Array;

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
 * Create intersection type guard
 * @template {Intersection} I
 * @param {I} intersection
 * @returns {TypeGuard<InferIntersection<I>>}
 */
const getIntersectionTypeGuard = (intersection) => {

	// Check for exactly two type guards union
	if (hasTwoElements(intersection)) {

		const [ first, second ] = intersection;

		/** @type {TypeGuard<InferIntersection<I>>} */
		const check = (value) => (first(value) && second(value));

		return check;
	}

	/** @type {TypeGuard<InferIntersection<I>>} */
	const check = (value) => {

		// Check for at least one element to match type
		for (const type of intersection) {
			if (!type(value)) {
				return false;
			}
		}

		return true;
	};

	return check;
};

/**
 * Check for intersection type values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
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
	if (!hasAtLeastTwoElements(intersection)) {
		throw TypeError(notEnoughTypeGuards);
	}

	// Check for any type guard in the intersection
	if (intersection.some(isAnyTypeGuard)) {
		return isAny;
	}

	const annotation = getIntersectionAnnotation(intersection);
	const check = getIntersectionTypeGuard(intersection);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		children: intersection.map(getTypeGuardMeta),
		classification: 'intersection',
		description: `an intersection of ${annotation}`,
		types: intersection
	});

	return check;
};

/**
 * Extract intersection type values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {Intersection} I
 * @param {I} intersection
 * @param {InferIntersection<I>} initial
 * @returns {TransformFunction<InferIntersection<I>>}
 */
const getIntersectionOf = (intersection, initial) =>
	getType(isIntersectionOf(intersection), initial);

/**
 * Extract and validate intersection type values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Intersection} I
 * @param {I} intersection
 * @returns {TransformFunction<InferIntersection<I>>}
 */
const parseIntersectionOf = (intersection) =>
	parseType(isIntersectionOf(intersection));

module.exports = {
	getIntersectionOf,
	intersection: isIntersectionOf,
	isIntersectionOf,
	parseIntersectionOf
};