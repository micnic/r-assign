'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

const invalidDefaultValue = 'Invalid default value, bigint expected';

/**
 * Check for bigint values
 * @param {any} value
 * @returns {value is bigint}
 */
const isBigInt = (value) => {

	return (typeof value === 'bigint');
};

/**
 * Creator of transform functions for bigint values
 * @param {bigint} [initial]
 * @returns {TransformFunction<bigint>}
 */
const getBigInt = (initial = 0n) => {

	// Check for default value to be a bigint
	if (!isBigInt(initial)) {
		throw TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Just return bigint values
		if (isBigInt(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Transform function to validate bigint values
 * @type {TransformFunction<bigint>}
 */
const parseBigInt = (value, key) => {

	// Check for bigint values to validate them
	if (!isBigInt(value)) {
		throw new TypeError(`Property ${key} is expected to be a bigint`);
	}

	return value;
};

module.exports = {
	getBigInt,
	isBigInt,
	parseBigInt
};