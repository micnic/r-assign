'use strict';

const {
	invalidPropertyType,
	setTypeGuardMeta
} = require('r-assign/lib/common');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @typedef {import('r-assign/lib').Primitive} Primitive
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const { isArray } = Array;
const { isFinite } = Number;

const duplicateLiteral = 'Duplicate literal provided';
const invalidLiteral = 'Invalid literal provided';
const invalidLiterals = 'Invalid literals provided';
const notEnoughLiterals = 'Not enough literals, at least two expected';

/**
 * Get literal annotation
 * @template {Primitive} P
 * @param {P} literal
 * @returns {string}
 */
const getLiteralAnnotation = (literal) => {

	// Add quotes for string literals
	if (typeof literal === 'string') {
		return `"${literal}"`;
	}

	return String(literal);
};

/**
 * Get literals annotation
 * @template {Primitive} P
 * @param {P[]} literals
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

	// Check for invalid literal types
	if ((typeof literal === 'object' && literal !== null) ||
		(typeof literal === 'number' && !isFinite(literal)) ||
		typeof literal === 'function' ||
		typeof literal === 'undefined') {
		throw TypeError(invalidLiteral);
	}

	// Check for duplicate literals
	if (literals && literals.indexOf(literal) !== index) {
		throw TypeError(duplicateLiteral);
	}
};

/**
 * Check for literal values
 * @template {Primitive} P
 * @param {P} literal
 * @returns {TypeGuard<P>}
 */
const isLiteral = (literal) => {

	// Validate provided literal
	validateLiteral(literal);

	const annotation = getLiteralAnnotation(literal);

	/** @type {TypeGuard<P>} */
	const check = (value) => (value === literal);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'literal',
		description: `${annotation} literal`
	});

	return check;
};

/**
 * Check for union of literal values
 * @template {Primitive} P
 * @param  {[P, P, ...P[]]} literals
 * @returns {TypeGuard<P>}
 */
const isLiteralOf = (literals) => {

	// Check for valid literals provided
	if (!isArray(literals)) {
		throw TypeError(invalidLiterals);
	}

	// Check for less than two literals
	if (literals.length <= 1) {
		throw TypeError(notEnoughLiterals);
	}

	// Validate each literal
	literals.forEach(validateLiteral);

	const annotation = getLiteralsAnnotation(literals);

	/** @type {TypeGuard<P>} */
	const check = (value) => literals.includes(value);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'union',
		description: `a union of literals ${annotation}`
	});

	return check;
};

/**
 * Extract literal values
 * @template {Primitive} P
 * @param {P} literal
 * @returns {TransformFunction<P>}
 */
const getLiteral = (literal) => {

	// Validate provided literal
	isLiteral(literal);

	return () => {

		return literal;
	};
};

/**
 * Extract union of literal values
 * @template {Primitive} P
 * @param {[P, P, ...P[]]} literals
 * @param {P} [initial]
 * @returns {TransformFunction<P>}
 */
const getLiteralOf = (literals, initial) => {

	const check = isLiteralOf(literals);

	// Check for default value to be an accepted literal or undefined
	if (typeof initial !== 'undefined' && !check(initial)) {
		throw TypeError(invalidPropertyType(check, true, initial));
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return value;
		}

		// Check for provided default value
		if (initial) {
			return initial;
		}

		return literals[0];
	};
};

/**
 * Extract and validate literal values
 * @template {Primitive} P
 * @param {P} literal
 * @returns {TransformFunction<P>}
 */
const parseLiteral = (literal) => {

	const check = isLiteral(literal);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidPropertyType(check, false, value, key));
		}

		return value;
	};
};

/**
 * Extract and validate union of literal values
 * @template {Primitive} P
 * @param {[P, P, ...P[]]} literals
 * @returns {TransformFunction<P>}
 */
const parseLiteralOf = (literals) => {

	const check = isLiteralOf(literals);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidPropertyType(check, false, value, key));
		}

		return value;
	};
};

module.exports = {
	getLiteral,
	getLiteralOf,
	isLiteral,
	isLiteralOf,
	parseLiteral,
	parseLiteralOf
};