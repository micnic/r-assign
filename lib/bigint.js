'use strict';

const {
	invalidInitialValue,
	invalidValue
} = require('r-assign/lib/internal/invalid-type');
const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
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
 * @deprecated will be removed in version 2.0, use getType instead
 * @param {bigint} [initial]
 * @returns {TransformFunction<bigint>}
 */
const getBigInt = (initial = 0n) => {

	// Check for default value to be a BigInt
	if (!isBigInt(initial)) {
		throw TypeError(invalidInitialValue(isBigInt, initial));
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
 * @deprecated will be removed in version 2.0, use parseType instead
 * @type {TransformFunction<bigint>}
 */
const parseBigInt = (value, key) => {

	// Check for BigInt values to validate them
	if (!isBigInt(value)) {
		throw TypeError(invalidValue(isBigInt, value, key));
	}

	return value;
};

module.exports = {
	getBigInt,
	isBigInt,
	parseBigInt
};