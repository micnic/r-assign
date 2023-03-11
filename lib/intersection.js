import {
	hasAtLeastTwoElements,
	hasTwoElements
} from './internal/array-checks.js';
import { invalidOptionalType } from './internal/invalid-type.js';
import {
	getTypeGuardMeta,
	isAnyTypeGuard,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isAny } from 'r-assign/any';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign').Intersection} Intersection
 */

/**
 * @template {Intersection} I
 * @typedef {import('r-assign').InferInt<I>} InferIntersection
 */

const { isArray } = Array;

const impossibleIntersection = 'Provided intersection is impossible';
const invalidTypeGuards = 'Invalid type guards provided';
const notEnoughTypeGuards = 'Not enough type guards, at least two expected';

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
export const isIntersectionOf = (intersection) => {

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

	// Check for invalid type guards
	for (const type of intersection) {

		const meta = getTypeGuardMeta(type);

		// Check for literal and primitive types
		if (
			meta.classification === 'literal' ||
			meta.classification === 'primitive'
		) {
			throw TypeError(impossibleIntersection);
		}

		// Check for optional type
		if (meta.classification === 'optional') {
			throw TypeError(invalidOptionalType('intersection'));
		}
	}

	const check = getIntersectionTypeGuard(intersection);

	// Save type guard meta
	setTypeGuardMeta(check, {
		children: intersection.map(getTypeGuardMeta),
		classification: 'intersection',
		types: intersection
	});

	return check;
};

export { isIntersectionOf as intersection };