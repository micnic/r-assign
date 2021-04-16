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
 * @typedef {import('r-assign/lib').Primitive} Primitive
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const invalidLiteral = 'Invalid literal provided';

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @param {Primitive} literal
 * @returns {string}
 */
const invalidPropertyType = (key, literal) => {
	return `Property "${key}" is expected to be: ${String(literal)}`;
};

/**
 * Check for literal values
 * @template {Primitive} T
 * @param {T} literal
 * @returns {TypeGuard<T>}
 */
const isLiteral = (literal) => {

	// Validate literal type
	if (literal !== null &&
		!isBigInt(literal) &&
		!isBoolean(literal) &&
		!isNumber(literal) &&
		!isString(literal) &&
		!isSymbol(literal)) {
		throw new TypeError(invalidLiteral);
	}

	/** @type {TypeGuard<T>} */
	const result = (value) => (value === literal);

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
			throw new TypeError(invalidPropertyType(key, literal));
		}

		return value;
	};
};

module.exports = {
	getLiteral,
	isLiteral,
	parseLiteral
};