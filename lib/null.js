'use strict';

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
const invalidTypeGuard = 'Invalid type guard provided';
const invalidTypeGuardReturn = 'Invalid return value of type guard';

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @returns {string}
 */
const invalidPropertyType = (key) => {
	return `Property "${key}" has invalid type`;
};

/**
 * Check for null values
 * @type {TypeGuard<null>}
 */
const isNull = (value) => {

	return (value === null);
};

/**
 * Check for nullable values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TypeGuard<InferTypeGuard<T> | null>}
 */
const isNullable = (type) => {

	// Check for valid type guard
	if (typeof type !== 'function') {
		throw new TypeError(invalidTypeGuard);
	}

	// Check for valid return value of type guard
	if (typeof type() !== 'boolean') {
		throw new TypeError(invalidTypeGuardReturn);
	}

	/** @type {TypeGuard<InferTypeGuard<T> | null>} */
	const result = (value) => {

		// Check for non-array values
		if (value === null) {
			return true;
		}

		return type(value);
	};

	return result;
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
		throw new TypeError(invalidTransform);
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
		throw new TypeError(invalidPropertyType(key));
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
			throw new TypeError(invalidPropertyType(key));
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