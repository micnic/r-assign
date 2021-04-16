'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const invalidDefaultValue = 'Invalid default value, BigInt expected';

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @returns {string}
 */
const invalidPropertyType = (key) => {
	return `Property "${key}" is expected to be a BigInt`;
};

/**
 * Check for BigInt values
 * @type {TypeGuard<bigint>}
 */
const isBigInt = (value) => {

	return (typeof value === 'bigint');
};

/**
 * Extract BigInt values
 * @param {bigint} [initial]
 * @returns {TransformFunction<bigint>}
 */
const getBigInt = (initial = 0n) => {

	// Check for default value to be a BigInt
	if (!isBigInt(initial)) {
		throw TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Just return BigInt values
		if (isBigInt(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Extract and validate BigInt values
 * @type {TransformFunction<bigint>}
 */
const parseBigInt = (value, key) => {

	// Check for BigInt values to validate them
	if (!isBigInt(value)) {
		throw new TypeError(invalidPropertyType(key));
	}

	return value;
};

module.exports = {
	getBigInt,
	isBigInt,
	parseBigInt
};