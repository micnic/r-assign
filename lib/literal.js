'use strict';

const { isBigInt } = require('r-assign/lib/bigint');
const { isBoolean } = require('r-assign/lib/boolean');
const { isNumber } = require('r-assign/lib/number');
const { isString } = require('r-assign/lib/string');
const { isSymbol } = require('r-assign/lib/symbol');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @typedef {import('r-assign/lib/literal').Primitive} Primitive
 */

const { isArray } = Array;

/**
 * Check for literal values
 * @template {Primitive} T
 * @param {T} literal
 * @param {any} [value]
 * @returns {value is T}
 */
const isLiteral = (literal, value) => {

	// Validate literal type
	if (literal !== null &&
		!isBigInt(literal) &&
		!isBoolean(literal) &&
		!isNumber(literal) &&
		!isString(literal) &&
		!isSymbol(literal)) {
		throw new TypeError('Invalid literal provided');
	}

	return (value === literal);
};

/**
 * Check for value of union of literals
 * @template {Primitive} T
 * @param {T[]} literals
 * @param {any} [value]
 * @returns {value is T}
 */
const isLiteralOf = (literals, value) => {

	// Check for valid types provided
	if (!isArray(literals) || literals.length === 0) {
		throw new TypeError('Invalid type checks provided');
	}

	return literals.some((literal) => isLiteral(literal, value));
};

/**
 * Creator of transform functions for literal values
 * @template {Primitive} T
 * @param {T} literal
 * @returns {TransformFunction<T>}
 */
const useLiteral = (literal) => {

	// Validate provided literal
	isLiteral(literal);

	return () => {

		return literal;
	};
};

/**
 * Creator of transform functions for values of union of literals
 * @template {Primitive} T
 * @template {T} I
 * @param {T[]} literals
 * @param {I} initial
 * @returns {TransformFunction<T>}
 */
const useLiteralOf = (literals, initial) => {

	// Check for default value to be of a valid type
	if (!isLiteralOf(literals, initial)) {
		throw new TypeError('Invalid default value');
	}

	return (value) => {

		// Return the valid values or the default value
		if (isLiteralOf(literals, value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Creator of transform functions for values of union of literals validation
 * @template {Primitive} T
 * @param {T[]} literals
 * @returns {TransformFunction<T>}
 */
const useLiteralOfValidation = (literals) => {

	// Validate provided literal
	isLiteralOf(literals);

	return (value, key) => {

		// Throw for invalid type values
		if (!isLiteralOf(literals, value)) {
			throw new TypeError(`Property ${key} has invalid type`);
		}

		return value;
	};
};

/**
 * Creator of transform functions for literal validation
 * @template {Primitive} T
 * @param {T} literal
 * @returns {TransformFunction<T>}
 */
const useLiteralValidation = (literal) => {

	// Validate provided literal
	isLiteral(literal);

	return (value, key) => {

		// Throw for invalid type values
		if (!isLiteral(literal, value)) {
			throw new TypeError(`Property ${key} is expected to be ${literal}`);
		}

		return value;
	};
};

module.exports = {
	isLiteral,
	isLiteralOf,
	useLiteral,
	useLiteralOf,
	useLiteralOfValidation,
	useLiteralValidation
};