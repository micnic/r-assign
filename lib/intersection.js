import {
	hasAtLeastTwoElements,
	hasOneElement,
	hasTwoElements
} from './internal/array-checks.js';
import {
	assertBaseTypeGuard,
	getTypeGuard,
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
 * @template {TypeGuard} T
 * @typedef {import('r-assign').InferT<T>} InferType
 */

/**
 * @typedef {import('r-assign').Intersection} Intersection
 */

/**
 * @template {Intersection} I
 * @typedef {import('r-assign').InferI<I>} InferIntersection
 */

const { isArray } = Array;
const { values } = Object;

const invalidTypeGuards = 'Invalid type guards provided';

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
 * @template {TypeGuard} T
 * @template {Intersection} I
 * @type {{
 *	(intersection: []): TypeGuard<never>;
 *	(intersection: [T]): TypeGuard<InferType<T>>;
 *	(intersection: I): TypeGuard<InferIntersection<I>>;
 * }}
 * @param {[] | [T] | I} types
 * @returns {any}
 */
export const isIntersectionOf = (types) => {

	// Check for valid types provided
	if (!isArray(types)) {
		throw TypeError(invalidTypeGuards);
	}

	const children = values(types)
		.map(getTypeGuardMeta)
		.filter((child) => child.classification !== 'never');

	// Assert for base type guards
	children.forEach((child) => assertBaseTypeGuard(child.classification));

	if (children.some(({ classification }) => classification === 'any')) {
		return isAny;
	}

	const intersection = children.map(getTypeGuard);

	if (!hasAtLeastTwoElements(intersection)) {
		if (hasOneElement(intersection)) {
			return intersection[0];
		}

		return isNever;
	}

	const check = getIntersectionTypeGuard(intersection);

	// Save type guard meta
	setTypeGuardMeta(check, {
		check,
		children,
		classification: 'intersection',
		intersection
	});

	return check;
};

export { isIntersectionOf as intersection };