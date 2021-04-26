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

const { isArray } = Array;

const invalidDefaultValue = 'Invalid default value';
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
 * Check for array values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TypeGuard<InferTypeGuard<T>[]>}
 */
const isArrayOf = (type) => {

	// Check for valid type guard
	if (typeof type !== 'function') {
		throw new TypeError(invalidTypeGuard);
	}

	// Check for valid return value of type guard
	if (typeof type() !== 'boolean') {
		throw new TypeError(invalidTypeGuardReturn);
	}

	/** @type {TypeGuard<InferTypeGuard<T>[]>} */
	const result = (value) => {

		// Check for non-array values
		if (!isArray(value)) {
			return false;
		}

		let counter = 0;

		const output = value.every((element, index) => {

			// Check for sparse arrays
			if (counter !== index) {
				return false;
			}

			// Increment the elements counter for checking for sparse arrays
			counter++;

			return type(element);
		});

		// Check for empty sparse arrays
		if (counter !== value.length) {
			return false;
		}

		return output;
	};

	return result;
};

/**
 * Extract array values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @param {InferTypeGuard<T>[]} [initial]
 * @returns {TransformFunction<InferTypeGuard<T>[]>}
 */
const getArrayOf = (type, initial = []) => {

	const check = isArrayOf(type);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw new TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return [ ...value ];
		}

		return [ ...initial ];
	};
};

/**
 * Extract and validate array values
 * @template {TypeGuard<any>} T
 * @param {T} type
 * @returns {TransformFunction<InferTypeGuard<T>[]>}
 */
const parseArrayOf = (type) => {

	const check = isArrayOf(type);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw new TypeError(invalidPropertyType(key));
		}

		return [ ...value ];
	};
};

module.exports = {
	getArrayOf,
	isArrayOf,
	parseArrayOf
};