'use strict';

const {
	getTypeGuardMeta,
	invalidPropertyType,
	setTypeGuardMeta
} = require('r-assign/lib/common');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const invalidTransform = 'Invalid transform function provided';

/**
 * Check for null values
 * @type {TypeGuard<null>}
 */
const isNull = (value) => {

	return (value === null);
};

// Save type guard meta
setTypeGuardMeta(isNull, {
	annotation: 'null',
	classification: 'literal',
	description: 'a null value'
});

/**
 * Check for nullable values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TypeGuard<InferTypeGuard<T> | null>}
 */
const isNullable = (type) => {

	const annotation = `(${getTypeGuardMeta(type).annotation} | null)`;

	/** @type {TypeGuard<InferTypeGuard<T> | null>} */
	const check = (value) => {

		// Check for non-array values
		if (value === null) {
			return true;
		}

		return type(value);
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'union',
		description: `an union of ${annotation}`
	});

	return check;
};

/**
 * Extract null values
 * @returns {TransformFunction<null>}
 */
const getNull = () => {

	return () => null;
};

/**
 * Extract nullable values
 * @template {TransformFunction<any>} T
 * @param {T} transform
 * @returns {TransformFunction<ReturnType<T> | null>}
 */
const getNullable = (transform) => {

	// Check for provided transform function
	if (typeof transform !== 'function') {
		throw TypeError(invalidTransform);
	}

	return (value, key, source) => {

		// Check for null values to accept them
		if (value === null) {
			return value;
		}

		return transform(value, key, source);
	};
};

/**
 * Extract and validate null values
 * @type {TransformFunction<null>}
 */
const parseNull = (value, key) => {

	// Throw for invalid type values
	if (!isNull(value)) {
		throw TypeError(invalidPropertyType(isNull, false, value, key));
	}

	return value;
};

/**
 * Extract and validate nullable values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TransformFunction<InferTypeGuard<T> | null>}
 */
const parseNullable = (type) => {

	const check = isNullable(type);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidPropertyType(check, false, value, key));
		}

		return value;
	};
};

module.exports = {
	getNull,
	getNullable,
	isNull,
	isNullable,
	parseNull,
	parseNullable
};