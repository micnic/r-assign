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

const { isFinite } = Number;

/**
 * Check for number values
 * @deprecated will be removed in version 2.0
 * @type {TypeGuard<number>}
 */
const isAnyNumber = (value) => (typeof value === 'number');

// Save type guard meta
setTypeGuardMeta(isAnyNumber, {
	annotation: 'number',
	classification: 'primitive',
	description: 'a number value',
	finite: false,
	primitive: 'number'
});

/**
 * Check for finite number values
 * @type {TypeGuard<number>}
 */
const isNumber = (value) => (isAnyNumber(value) && isFinite(value));

// Save type guard meta
setTypeGuardMeta(isNumber, {
	annotation: 'number',
	classification: 'primitive',
	description: 'a finite number value',
	finite: true,
	primitive: 'number'
});

/**
 * Extract number values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @param {number} [initial]
 * @returns {TransformFunction<number>}
 */
const getAnyNumber = (initial = 0) => getType(isAnyNumber, initial);

/**
 * Extract finite number values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @param {number} [initial]
 * @returns {TransformFunction<number>}
 */
const getNumber = (initial = 0) => getType(isNumber, initial);

/**
 * Extract and validate number values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<number>}
 */
const parseAnyNumber = parseType(isAnyNumber);

/**
 * Extract and validate finite number values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<number>}
 */
const parseNumber = parseType(isNumber);

module.exports = {
	anyNumber: isAnyNumber,
	getAnyNumber,
	getNumber,
	isAnyNumber,
	isNumber,
	number: isNumber,
	parseAnyNumber,
	parseNumber
};