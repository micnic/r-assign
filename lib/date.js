'use strict';

const { invalidDate } = require('r-assign/lib/internal/errors');
const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

const { isNaN } = Number;

/**
 * Check for date values
 * @deprecated will be removed in version 2.0
 * @type {TypeGuard<Date>}
 */
const isAnyDate = (value) => (value instanceof Date);

// Save type guard meta
setTypeGuardMeta(isAnyDate, {
	annotation: 'Date',
	builder: Date,
	classification: 'instance',
	description: 'an instance of Date'
});

/**
 * Transform number or string values to date
 * @deprecated will be removed in version 2.0
 * @type {TransformFunction<Date>}
 */
const convertToAnyDate = (value) => {

	// Check for string or number values
	if (typeof value === 'string' || typeof value === 'number') {
		return new Date(value);
	}

	// Check for date values
	if (isAnyDate(value)) {
		return value;
	}

	throw TypeError(invalidDate);
};

/**
 * Check for valid date values
 * @type {TypeGuard<Date>}
 */
const isDate = (value) => (isAnyDate(value) && !isNaN(value.getTime()));

// Save type guard meta
setTypeGuardMeta(isDate, {
	annotation: 'Date',
	builder: Date,
	classification: 'instance',
	description: 'an instance of valid Date'
});

/**
 * Transform number or string values to valid date
 * @deprecated will be removed in version 2.0, use `asDate()` instead
 * @type {TransformFunction<Date>}
 */
const convertToDate = (value) => {

	// Check for string or number values
	if (typeof value === 'string' || typeof value === 'number') {

		const date = new Date(value);

		// Check for valid date values
		if (isDate(date)) {
			return date;
		}

		throw TypeError(invalidDate);
	}

	// Check for date values
	if (isDate(value)) {
		return value;
	}

	throw TypeError(invalidDate);
};

module.exports = {
	anyDate: isAnyDate,
	asAnyDate: convertToAnyDate,
	asDate: convertToDate,
	convertToAnyDate,
	convertToDate,
	date: isDate,
	isAnyDate,
	isDate
};