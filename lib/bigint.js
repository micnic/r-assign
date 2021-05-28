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
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

/**
 * Check for BigInt values
 * @type {TypeGuard<bigint>}
 */
const isBigInt = (value) => {

	return (typeof value === 'bigint');
};

// Save type guard meta
setTypeGuardMeta(isBigInt, {
	annotation: 'bigint',
	classification: 'primitive',
	description: 'a BigInt value'
});

/**
 * Extract BigInt values
 * @param {bigint} [initial]
 * @returns {TransformFunction<bigint>}
 */
const getBigInt = (initial = 0n) => {

	// Check for default value to be a BigInt
	if (!isBigInt(initial)) {
		throw TypeError(invalidPropertyType(isBigInt, true, initial));
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
		throw TypeError(invalidPropertyType(isBigInt, false, value, key));
	}

	return value;
};

module.exports = {
	getBigInt,
	isBigInt,
	parseBigInt
};