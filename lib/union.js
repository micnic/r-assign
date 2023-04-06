import {
	hasAtLeastTwoElements,
	hasNoElements,
	hasOneElement,
	hasTwoElements
} from './internal/array-checks.js';
import {
	assertBaseTypeGuard,
	getTypeGuard,
	getTypeGuardMeta,
	isStringTypeGuard,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isAny } from 'r-assign/any';
import { isLiteral, isLiteralOf } from 'r-assign/literal';
import { isNever } from 'r-assign/never';

/**
 * @typedef {import('r-assign').Literal} Literal
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign').Union} Union
 */

/**
 * @template {Union} U
 * @typedef {import('r-assign').InferU<U>} InferUnion
 */

/**
 * @typedef {import('./internal/index.js').TypeGuardMeta} TypeGuardMeta
 */

const { isArray } = Array;
const { values } = Object;

const invalidTypeGuards = 'Invalid type guards provided';

/**
 * Check for literal primitive in the union type
 * @param {TypeGuard[]} union
 * @param {Literal} literal
 * @returns {boolean}
 */
const findLiteralPrimitive = (union, literal) => union.some((type) => {

	const meta = getTypeGuardMeta(type);

	return (
		meta.classification === 'primitive' &&
		typeof literal === meta.primitive
	);
});

/**
 * Find literal in other members of the union
 * @param {TypeGuard[]} union
 * @param {Literal} literal
 * @returns {boolean}
 */
const findLiteralUnion = (union, literal) => union.some((type) => {

	const meta = getTypeGuardMeta(type);

	return (
		meta.classification === 'literals' &&
		meta.literals.includes(literal)
	);
});

/**
 * Unwrap an filter union types
 * @param {TypeGuard} type
 * @param {number} index
 * @param {TypeGuard[]} union
 * @returns {TypeGuardMeta | TypeGuardMeta[]}
 */
const mapUnion = (type, index, union) => {

	// Filter repeated type guards
	if (union.indexOf(type) !== index) {
		return [];
	}

	const meta = getTypeGuardMeta(type);

	// Assert for base type guard
	assertBaseTypeGuard(meta.classification);

	// Switch on type classification
	switch (meta.classification) {

		case 'literal': {

			// Check for literal primitive to filter out the literal
			if (findLiteralPrimitive(union, meta.literal)) {
				return [];
			}

			// Check for literal union to filter out the literal
			if (findLiteralUnion(union, meta.literal)) {
				return [];
			}

			return meta;
		}

		case 'literals': {

			const literals = meta.literals.flatMap((literal) => {

				// Check for literals that can be reduced
				if (findLiteralPrimitive(union, literal)) {
					return [];
				}

				return literal;
			});

			// Check if literals changed
			if (literals.length === meta.literals.length) {
				return meta;
			}

			// Check for a new set of literals
			if (hasAtLeastTwoElements(literals)) {
				return getTypeGuardMeta(isLiteralOf(literals));
			}

			// Check for only one literal
			if (hasOneElement(literals)) {
				return getTypeGuardMeta(isLiteral(literals[0]));
			}

			return [];
		}

		case 'never': {
			return [];
		}

		case 'template-literal': {

			// Check for string primitive to filter out the template literal
			if (union.some(isStringTypeGuard)) {
				return [];
			}

			return meta;
		}

		case 'union': {
			return meta.children;
		}

		default: {
			return meta;
		}
	}
};

/**
 * Create union type guard
 * @template {Union} U
 * @param {U} union
 * @returns {TypeGuard<InferUnion<U>>}
 */
const getUnionTypeGuard = (union) => {

	// Check for exactly two type guards union
	if (hasTwoElements(union)) {

		const [ first, second ] = union;

		/** @type {TypeGuard<InferUnion<U>>} */
		const check = (value) => (first(value) || second(value));

		return check;
	}

	/** @type {TypeGuard<InferUnion<U>>} */
	const check = (value) => union.some((type) => type(value));

	return check;
};

/**
 * Check for union type values
 * @template {Union} U
 * @param {U} types
 * @returns {TypeGuard<InferUnion<U>>}
 */
export const isUnionOf = (types) => {

	// Check for valid type guards provided
	if (!isArray(types)) {
		throw TypeError(invalidTypeGuards);
	}

	const children = values(types).flatMap(mapUnion);

	// Check for any type guard in the union
	if (children.some(({ classification }) => classification === 'any')) {
		return isAny;
	}

	const union = children.map(getTypeGuard);

	// Check for no type provided
	if (hasNoElements(union)) {
		return isNever;
	}

	// Check for one type provided
	if (hasOneElement(union)) {
		return union[0];
	}

	const check = getUnionTypeGuard(union);

	// Save type guard meta
	setTypeGuardMeta(check, {
		check,
		children,
		classification: 'union',
		union
	});

	return check;
};

export { isUnionOf as union };