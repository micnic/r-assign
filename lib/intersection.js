import {
	hasAtLeastTwoElements,
	hasTwoElements
} from './internal/array-checks.js';
import {
	assertBaseTypeGuard,
	getTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isAny } from 'r-assign/any';
import { isNever } from 'r-assign/never';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign').Intersection} Intersection
 */

/**
 * @template {Intersection} I
 * @typedef {import('r-assign').InferI<I>} InferIntersection
 */

const { isArray } = Array;

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
	const check = (value) => intersection.every((type) => type(value));

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

	const children = intersection.map(getTypeGuardMeta);

	// Assert for base type guard
	for (const child of children) {
		assertBaseTypeGuard(child.classification);
	}

	if (children.some(({ classification }) => classification === 'any')) {
		return isAny;
	}

	if (
		children.some(
			({ classification }) =>
				classification === 'literal' ||
				classification === 'never' ||
				classification === 'primitive'
		)
	) {
		return isNever;
	}

	const check = getIntersectionTypeGuard(intersection);

	// Save type guard meta
	setTypeGuardMeta(check, {
		check,
		children,
		classification: 'intersection',
		types: intersection
	});

	return check;
};

export { isIntersectionOf as intersection };