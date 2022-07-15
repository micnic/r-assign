'use strict';

const { getType } = require('r-assign/lib/get-type');
const {
	invalidLiteral,
	invalidLiterals
} = require('r-assign/lib/internal/errors');
const { hasAtLeastTwoElements } = require('r-assign/lib/internal/array-checks');
const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');
const { parseType } = require('r-assign/lib/parse-type');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @typedef {import('r-assign/lib').Literal} Literal
 */

/**
 * @template {Literal} L
 * @typedef {import('r-assign/lib').Literals<L>} Literals
 */

/**
 * @template {Literal} L
 * @template {Literals<L>} T
 * @typedef {import('r-assign/lib').InferL<L, T>} InferLiterals
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

const { isArray } = Array;
const { isFinite } = Number;

const duplicateLiteral = 'Duplicate literal provided';
const notEnoughLiterals = 'Not enough literals, at least two expected';

/**
 * Get literal annotation
 * @template {Literal} L
 * @param {L} literal
 * @returns {string}
 */
const getLiteralAnnotation = (literal) => {

	// Add "n" suffix for bigint literals
	if (typeof literal === 'bigint') {
		return `${literal}n`;
	}

	// Add quotes for string literals
	if (typeof literal === 'string') {
		return `"${literal}"`;
	}

	return String(literal);
};

/**
 * Get literals annotation
 * @template {Literal} L
 * @param {L[]} literals
 * @returns {string}
 */
const getLiteralsAnnotation = (literals) => {

	return `(${literals.map(getLiteralAnnotation).join(' | ')})`;
};

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
const isLiteral = (literal) => {

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
const isLiteralOf = (literals) => {

	// Check for valid literals provided
	if (!isArray(literals)) {
		throw TypeError(invalidLiterals);
	}

	// Check for less than two literals
	if (!hasAtLeastTwoElements(literals)) {
		throw TypeError(notEnoughLiterals);
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

/**
 * Extract literal values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {Literal} L
 * @param {L} literal
 * @returns {TransformFunction<L>}
 */
const getLiteral = (literal) => getType(isLiteral(literal), literal);

/**
 * Extract union of literal values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {Literal} L
 * @template {Literals<L>} T
 * @param  {T} literals
 * @param {InferLiterals<L, T>} initial
 * @returns {TransformFunction<InferLiterals<L, T>>}
 */
const getLiteralOf = (literals, initial) =>
	getType(isLiteralOf(literals), initial);

/**
 * Extract and validate literal values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Literal} L
 * @param {L} literal
 * @returns {TransformFunction<L>}
 */
const parseLiteral = (literal) => parseType(isLiteral(literal));

/**
 * Extract and validate union of literal values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Literal} L
 * @template {Literals<L>} T
 * @param  {T} literals
 * @returns {TransformFunction<InferLiterals<L, T>>}
 */
const parseLiteralOf = (literals) => parseType(isLiteralOf(literals));

module.exports = {
	getLiteral,
	getLiteralOf,
	isLiteral,
	isLiteralOf,
	literal: isLiteral,
	literals: isLiteralOf,
	parseLiteral,
	parseLiteralOf
};