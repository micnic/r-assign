import {
	invalidLiteral,
	invalidLiterals
} from './internal/errors.js';
import {
	hasAtLeastOneElement,
	hasOneElement
} from './internal/array-checks.js';
import { setTypeGuardMeta } from './internal/type-guard-meta.js';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

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

const duplicateLiteral = 'Duplicate literal provided';
const notEnoughLiterals = 'Not enough literals, at least one expected';

/**
 * Get literal annotation
 * @template {Literal} L
 * @param {L} literal
 * @returns {string}
 */
const getLiteralAnnotation = (literal) => {

	// Switch on literal type
	switch (typeof literal) {

		case 'bigint': {
			return `${literal}n`;
		}

		case 'string': {
			return `"${literal}"`;
		}

		default: {
			return String(literal);
		}
	}
};

/**
 * Get literals annotation
 * @template {Literal} L
 * @param {L[]} literals
 * @returns {string}
 */
const getLiteralsAnnotation = (literals) =>
	literals.map(getLiteralAnnotation).join(' | ');

/**
 * Validate provided literal
 * @param {any} literal
 * @param {number} [index]
 * @param {any[]} [literals]
 */
const validateLiteral = (literal, index, literals) => {

	const type = typeof literal;

	// Check for invalid literal types
	if ((type === 'object' && literal !== null) ||
		(type === 'number' && !isFinite(literal)) ||
		type === 'function' || type === 'symbol') {
		throw TypeError(invalidLiteral);
	}

	// Check for duplicate literals
	if (literals && literals.indexOf(literal) !== index) {
		throw TypeError(duplicateLiteral);
	}
};

/**
 * Check for literal values
 * @template {Literal} L
 * @param {L} literal
 * @returns {TypeGuard<L>}
 */
export const isLiteral = (literal) => {

	// Validate provided literal
	validateLiteral(literal);

	const annotation = getLiteralAnnotation(literal);

	/** @type {TypeGuard<L>} */
	const check = (value) => (value === literal);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'literal',
		description: `${annotation} literal`,
		literal
	});

	return check;
};

/**
 * Check for union of literal values
 * @template {Literal} L
 * @template {Literals<L>} T
 * @param  {T} literals
 * @returns {TypeGuard<InferLiterals<L, T>>}
 */
export const isLiteralOf = (literals) => {

	// Check for valid literals provided
	if (!isArray(literals)) {
		throw TypeError(invalidLiterals);
	}

	// Check for at least one literal provided
	if (!hasAtLeastOneElement(literals)) {
		throw TypeError(notEnoughLiterals);
	}

	// Check for one literal
	if (hasOneElement(literals)) {

		/** @type {TypeGuard} */
		const check = isLiteral(literals[0]);

		return check;
	}

	// Sort and validate each literal
	literals.slice(0).sort().forEach(validateLiteral);

	const annotation = getLiteralsAnnotation(literals);

	/** @type {TypeGuard<InferLiterals<L, T>>} */
	const check = (value) => literals.includes(value);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'literals',
		description: `a union of literals ${annotation}`,
		literals
	});

	return check;
};

export { isLiteral as literal, isLiteralOf as literals };