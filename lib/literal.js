import { hasNoElements, hasOneElement } from './internal/array-checks.js';
import { setTypeGuardMeta } from './internal/type-guard-meta.js';
import { isNever } from 'r-assign/never';

/**
 * @typedef {import('r-assign').Literal} Literal
 */

/**
 * @template {Literal} L
 * @typedef {import('r-assign').Literals<L>} Literals
 */

/**
 * @template {Literal} L
 * @template {Literals<L>} T
 * @typedef {import('r-assign').InferL<L, T>} InferLiterals
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

const { isArray } = Array;
const { isFinite } = Number;
const { values } = Object;

const invalidLiteral = 'Invalid literal provided';
const invalidLiterals = 'Invalid literals provided';

/**
 * Validate provided literal
 * @param {any} literal
 * @returns {asserts literal is Literal}
 */
const validateLiteral = (literal) => {

	const type = typeof literal;

	// Check for invalid literal types
	if ((type === 'object' && literal !== null) ||
		(type === 'number' && !isFinite(literal)) ||
		type === 'function' || type === 'symbol') {
		throw TypeError(invalidLiteral);
	}
};

/**
 * Validate provided literals and filter out duplicates
 * @param {Literal} literal
 * @param {number} index
 * @param {Literal[]} literals
 * @returns {Literal | []}
 */
const mapLiterals = (literal, index, literals) => {

	// Validate provided literal
	validateLiteral(literal);

	// Check for duplicate literals
	if (literals && literals.indexOf(literal) !== index) {
		return [];
	}

	return literal;
};

/**
 * Check for literal values
 * @template {Literal} [L = undefined]
 * @param {L} [literal]
 * @returns {TypeGuard<L>}
 */
export const isLiteral = (literal) => {

	// Validate provided literal
	validateLiteral(literal);

	/** @type {TypeGuard<L>} */
	const check = (value) => (value === literal);

	// Save type guard meta
	setTypeGuardMeta(check, {
		check,
		classification: 'literal',
		literal
	});

	return check;
};

/**
 * Check for union of literal values
 * @template {Literal} L
 * @template {Literals<L>} T
 * @param  {T} set
 * @returns {TypeGuard<InferLiterals<L, T>>}
 */
export const isLiteralOf = (set) => {

	// Check for valid literals provided
	if (!isArray(set)) {
		throw TypeError(invalidLiterals);
	}

	// Check for no literals provided
	if (hasNoElements(set)) {
		return isNever;
	}

	// Check for one literal
	if (hasOneElement(set)) {

		/** @type {TypeGuard} */
		const check = isLiteral(set[0]);

		return check;
	}

	const literals = values(set).flatMap(mapLiterals).sort();

	/** @type {TypeGuard<InferLiterals<L, T>>} */
	const check = (value) => literals.includes(value);

	// Save type guard meta
	setTypeGuardMeta(check, {
		check,
		classification: 'literals',
		literals
	});

	return check;
};

export { isLiteral as literal, isLiteralOf as literals };