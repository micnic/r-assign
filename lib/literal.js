'use strict';

const { invalidPropertyType } = require('r-assign/lib/common');

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

const invalidDefaultValue = 'Invalid default value';
const invalidLiteral = 'Invalid literal provided';
const invalidLiterals = 'Invalid literals provided';
const notEnoughLiterals = 'Not enough literals, at least two expected';

/**
 * Returns message for literal values
 * @template {Primitive} T
 * @param {T | [T, T, ...T[]]} literals
 * @returns
 */
const getType = (literals) => {

	if (isArray(literals)) {
		return `one of the literals: ${literals.join(', ')}`;
	}

	return `"${literals}" literal`;
};

/**
 * Validate provided literal
 * @param {any} literal
 */
const validateLiteral = (literal) => {

	// Check for invalid literal types
	if ((literal !== null && typeof literal === 'object') ||
		(!isFinite(literal) && typeof literal === 'number') ||
		typeof literal === 'function' ||
		typeof literal === 'undefined') {
		throw new TypeError(invalidLiteral);
	}
};

/**
 * Check for literal values
 * @template {Primitive} T
 * @param {T} literal
 * @returns {TypeGuard<T>}
 */
const isLiteral = (literal) => {

	// Validate provided literal
	validateLiteral(literal);

	/** @type {TypeGuard<T>} */
	const result = (value) => (value === literal);

	return result;
};

/**
 * Check for union of literal values
 * @template {Primitive} T
 * @param  {[T, T, ...T[]]} literals
 * @returns {TypeGuard<T>}
 */
const isLiteralOf = (literals) => {

	// Check for valid literals provided
	if (!isArray(literals)) {
		throw new TypeError(invalidLiterals);
	}

	// Check for less than two literals
	if (literals.length <= 1) {
		throw new TypeError(notEnoughLiterals);
	}

	// Validate each literal
	literals.forEach(validateLiteral);

	/** @type {TypeGuard<T>} */
	const result = (value) => literals.includes(value);

	return result;
};

/**
 * Extract literal values
 * @template {Primitive} T
 * @param {T} literal
 * @returns {TransformFunction<T>}
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
 * @template {Primitive} T
 * @param {[T, T, ...T[]]} literals
 * @param {T} [initial]
 * @returns {TransformFunction<T>}
 */
const getLiteralOf = (literals, initial = literals[0]) => {

	const check = isLiteralOf(literals);

	// Check for default value to be an accepted literal
	if (!check(initial)) {
		throw new TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Extract and validate literal values
 * @template {Primitive} T
 * @param {T} literal
 * @returns {TransformFunction<T>}
 */
const parseLiteral = (literal) => {

	const check = isLiteral(literal);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key, getType(literal)));
		}

		return value;
	};
};

/**
 * Extract and validate union of literal values
 * @template {Primitive} T
 * @param {[T, T, ...T[]]} literals
 * @returns {TransformFunction<T>}
 */
const parseLiteralOf = (literals) => {

	const check = isLiteralOf(literals);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key, getType(literals)));
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