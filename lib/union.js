'use strict';

const { getType } = require('r-assign/lib/get-type');
const {
	hasAtLeastTwoElements,
	hasOneElement,
	hasTwoElements
} = require('r-assign/lib/internal/array-checks');
const { invalidOptionalType } = require('r-assign/lib/internal/invalid-type');
const {
	getTypeGuardMeta,
	isAnyTypeGuard,
	isStringTypeGuard,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
const { isAny } = require('r-assign/lib/any');
const { isLiteral, isLiteralOf } = require('r-assign/lib/literal');
const { parseType } = require('r-assign/lib/parse-type');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @typedef {import('r-assign/lib').Literal} Literal
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').InferTG<T>} InferTypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Union} Union
 */

/**
 * @template {Union} U
 * @typedef {import('r-assign/lib').InferU<U>} InferUnion
 */

const { isArray } = Array;
const { values } = Object;

const invalidTypeGuards = 'Invalid type guards provided';
const notEnoughTypeGuards = 'Not enough type guards, at least two expected';

/**
 * Get union annotation
 * @param {TypeGuard[]} union
 * @returns {string}
 */
const getUnionAnnotation = (union) => {

	/** @type {string[]} */
	const annotations = [];

	// Loop over all type guards
	for (const type of union) {

		const { annotation } = getTypeGuardMeta(type);

		// Add annotation to the list if it is not already in the list
		if (!annotations.includes(annotation)) {
			annotations.push(annotation);
		}
	}

	// Return the annotation for just one type
	if (hasOneElement(annotations)) {
		return annotations[0];
	}

	return annotations.join(' | ');
};

/**
 * Check for literal primitive in the union type
 * @param {TypeGuard[]} union
 * @param {Literal} literal
 * @returns {boolean}
 */
const findLiteralPrimitive = (union, literal) => {

	return union.some((type) => {

		const meta = getTypeGuardMeta(type);

		return (
			meta.classification === 'primitive' &&
			typeof literal === meta.primitive
		);
	});
};

/**
 * Find literal in other members of the union
 * @param {TypeGuard[]} union
 * @param {Literal} literal
 * @returns {boolean}
 */
const findLiteralUnion = (union, literal) => {

	return union.some((type) => {

		const meta = getTypeGuardMeta(type);

		return (
			meta.classification === 'literals' &&
			meta.literals.includes(literal)
		);
	});
};

/**
 * Unwrap an filter union types
 * @param {TypeGuard} type
 * @param {number} index
 * @param {TypeGuard[]} union
 * @returns {TypeGuard | TypeGuard[]}
 */
const mapUnion = (type, index, union) => {

	// Filter repeated type guards
	if (union.indexOf(type) !== index) {
		return [];
	}

	const meta = getTypeGuardMeta(type);

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

			return type;
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
				return type;
			}

			// Check for a new set of literals
			if (hasAtLeastTwoElements(literals)) {
				return isLiteralOf(literals);
			}

			// Check for only one literal
			if (hasOneElement(literals)) {
				return isLiteral(literals[0]);
			}

			return [];
		}

		case 'optional': {
			throw TypeError(invalidOptionalType('union'));
		}

		case 'template-literal': {

			// Check for string primitive to filter out the template literal
			if (union.some(isStringTypeGuard)) {
				return [];
			}

			return type;
		}

		case 'union': {
			return meta.union;
		}

		default: {
			return type;
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
	const check = (value) => {

		// Check for at least one element to match type
		for (const type of union) {
			if (type(value)) {
				return true;
			}
		}

		return false;
	};

	return check;
};

/**
 * Check for union type values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @template {Union} U
 * @param {U} types
 * @returns {TypeGuard<InferUnion<U>>}
 */
const isUnionOf = (types) => {

	// Check for valid type guards provided
	if (!isArray(types)) {
		throw TypeError(invalidTypeGuards);
	}

	// Check for less than two type guards
	if (!hasAtLeastTwoElements(types)) {
		throw TypeError(notEnoughTypeGuards);
	}

	const union = values(types).flatMap(mapUnion);

	// Check for any type guard in the union
	if (union.some(isAnyTypeGuard)) {
		return isAny;
	}

	// Check again for enough type guards after union reduction
	if (!hasAtLeastTwoElements(union)) {

		// Check for one type guard
		if (hasOneElement(union)) {
			return union[0];
		}

		throw TypeError(notEnoughTypeGuards);
	}

	const annotation = getUnionAnnotation(union);
	const check = getUnionTypeGuard(union);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		children: union.map(getTypeGuardMeta),
		classification: 'union',
		description: `an union of ${annotation}`,
		union
	});

	return check;
};

/**
 * Extract union type values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {Union} U
 * @param {U} union
 * @param {InferUnion<U>} initial
 * @returns {TransformFunction<InferUnion<U>>}
 */
const getUnionOf = (union, initial) => getType(isUnionOf(union), initial);

/**
 * Extract and validate union type values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Union} U
 * @param {U} union
 * @returns {TransformFunction<InferUnion<U>>}
 */
const parseUnionOf = (union) => parseType(isUnionOf(union));

module.exports = {
	getUnionOf,
	isUnionOf,
	parseUnionOf,
	union: isUnionOf
};