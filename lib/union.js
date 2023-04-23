import {
	hasAtLeastOneElement,
	hasNoElements,
	hasOneElement,
	hasTwoElements
} from './internal/array-checks.js';
import {
	assertExcludeClassification,
	getTypeGuard,
	getTypeGuardMeta,
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
 * @typedef {import('./internal/index.js').TGM} TypeGuardMeta
 */

/**
 * @typedef {import('./internal/index.js').ATGM} AnyTypeGuardMeta
 */

/**
 * @typedef {import('./internal/index.js').BTGM} BaseTypeGuardMeta
 */

/**
 * @typedef {import('./internal/index.js').LTGM} LiteralTypeGuardMeta
 */

/**
 * @typedef {import('./internal/index.js').PT} PrimitiveType
 */

/**
 * @template {PrimitiveType} T
 * @typedef {import('./internal/index.js').PTGM<T>} PrimitiveTypeGuardMeta
 */

/**
 * @typedef {import('./internal/index.js').UC} UnionChild
 */

const { isArray } = Array;
const { values } = Object;

const invalidTypeGuards = 'Invalid type guards provided';

/**
 * Assert union child
 * @param {TypeGuardMeta} child
 * @returns {asserts child is UnionChild}
 */
const assertChild = (child) =>
	assertExcludeClassification(child.classification, [
		'any',
		'never',
		'optional',
		'rest',
		'union'
	]);

/**
 * Assert union children
 * @param {TypeGuardMeta[]} children
 * @returns {asserts children is UnionChild[]}
 */
const assertChildren = (children) => children.forEach(assertChild);

/**
 * Find literal primitive
 * @param {TypeGuardMeta[]} metas
 * @param {Literal} literal
 * @returns {boolean}
 */
const hasLiteralPrimitive = (metas, literal) =>
	metas.some(
		(meta) => (
			meta.classification === 'primitive' &&
			typeof literal === meta.primitive
		)
	);

/**
 * Extract literal from literal type guard meta
 * @param {LiteralTypeGuardMeta} meta
 * @returns {Literal}
 */
const getLiteral = (meta) => meta.literal;

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
 * Check for any type guard meta
 * @param {TypeGuardMeta} meta
 * @returns {meta is AnyTypeGuardMeta}
 */
const isAnyTypeGuardMeta = (meta) => (meta.classification === 'any');

/**
 * Check for literal type guard meta
 * @param {TypeGuardMeta} meta
 * @returns {meta is LiteralTypeGuardMeta}
 */
const isLiteralTypeGuardMeta = (meta) => (meta.classification === 'literal');

/**
 * Check for string type guard meta
 * @param {TypeGuardMeta} meta
 * @returns {meta is PrimitiveTypeGuardMeta<'string'>}
 */
const isStringTypeGuardMeta = (meta) =>
	(meta.classification === 'primitive' && meta.primitive === 'string');

/**
 * Unwrap and filter union types
 * @param {TypeGuardMeta} meta
 * @param {number} index
 * @param {TypeGuardMeta[]} union
 * @returns {TypeGuardMeta | TypeGuardMeta[]}
 */
const reduceUnion = (meta, index, union) => {

	// Filter repeated type guards
	if (union.indexOf(meta) !== index) {
		return [];
	}

	// Switch on type classification
	switch (meta.classification) {

		case 'literal': {

			// Check for literal primitive to filter out the literal
			if (hasLiteralPrimitive(union, meta.literal)) {
				return [];
			}

			return meta;
		}

		case 'template-literal': {

			// Check for string primitive to filter out the template literal
			if (union.some(isStringTypeGuardMeta)) {
				return [];
			}

			return meta;
		}

		default: {
			return meta;
		}
	}
};

/**
 * Get literal type guard meta from provided literal
 * @param {Literal} literal
 * @returns {TypeGuardMeta}
 */
const unwrapLiteral = (literal) => getTypeGuardMeta(isLiteral(literal));

/**
 * Unwrap union type guard meta
 * @param {TypeGuardMeta} meta
 * @returns {TypeGuardMeta | TypeGuardMeta[]}
 */
const unwrapUnion = (meta) => {

	// Switch on type classification
	switch (meta.classification) {

		case 'literals': {
			return meta.literals.map(unwrapLiteral);
		}

		case 'never': {
			return [];
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

	const children = values(types)
		.map(getTypeGuardMeta)
		.flatMap(unwrapUnion)
		.flatMap(reduceUnion);

	const literals = children.filter(isLiteralTypeGuardMeta);

	// Check for at least one literal
	if (hasAtLeastOneElement(literals)) {

		// Remove literals from children
		literals.forEach((literal) => {
			children.splice(children.indexOf(literal), 1);
		});

		// Add literals to the beginning of children
		children.unshift(
			getTypeGuardMeta(isLiteralOf(literals.map(getLiteral)))
		);
	}

	// Check for any type in the union
	if (children.some(isAnyTypeGuardMeta)) {
		return isAny;
	}

	// Assert for valid children
	assertChildren(children);

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