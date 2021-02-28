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
 * Creator of transform functions for literal values
 * @template {Primitive} T
 * @param {T} literal
 * @returns {TransformFunction<T>}
 */
const useLiteralValidation = (literal) => {

	// Validate provided literal
	isLiteral(literal);

	return (value, key) => {

		//
		if (!isLiteral(literal, value)) {
			throw new TypeError(`Property ${key} is expected to be ${literal}`);
		}

		return literal;
	};
};

module.exports = {
	isLiteral,
	useLiteral,
	useLiteralValidation
};