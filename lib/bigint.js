'use strict';

const { getType } = require('r-assign/lib/get-type');
const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');
const { parseType } = require('r-assign/lib/parse-type');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * Check for BigInt values
 * @type {TypeGuard<bigint>}
 */
const isBigInt = (value) => (typeof value === 'bigint');

// Save type guard meta
setTypeGuardMeta(isBigInt, {
	annotation: 'bigint',
	classification: 'primitive',
	description: 'a BigInt value',
	primitive: 'bigint'
});

/**
 * Extract BigInt values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @param {bigint} [initial]
 * @returns {TransformFunction<bigint>}
 */
const getBigInt = (initial = 0n) => getType(isBigInt, initial);

/**
 * Extract and validate BigInt values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<bigint>}
 */
const parseBigInt = parseType(isBigInt);

module.exports = {
	bigint: isBigInt,
	getBigInt,
	isBigInt,
	parseBigInt
};