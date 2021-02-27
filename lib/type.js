'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/type').TypeChecker<T>} TypeChecker
 */

/**
 * @template T
 * @typedef {import('r-assign/lib/type').ExtractTypeGuard<T>} ExtractTypeGuard
 */

const { isArray } = Array;

/**
 * Check for values of union types
 * @template {TypeChecker<any>} T
 * @param {T[]} types
 * @param {any} [value]
 * @returns {value is ExtractTypeGuard<T>}
 */
const isTypeOf = (types, value) => {

	// Check for valid types provided
	if (!isArray(types) || types.length === 0) {
		throw new TypeError('Invalid type checks provided');
	}

	return types.some((type) => {

		// Check for valid specific type
		if (typeof type !== 'function') {
			throw new TypeError('Invalid type check provided');
		}

		const result = type(value);

		// Check for valid return value of type check
		if (typeof result !== 'boolean') {
			throw new TypeError('Invalid return value of type check');
		}

		return result;
	});
};

/**
 * Creator of transform functions for optional values
 * @template {TransformFunction<any>} T
 * @param {T} transform
 * @returns {TransformFunction<ReturnType<T> | undefined>}
 */
const useOptional = (transform) => {

	// Check for provided transform function
	if (typeof transform !== 'function') {
		throw new TypeError('Invalid transform function provided');
	}

	return (value, key, source) => {

		// Check for undefined values to accept them
		if (typeof value === 'undefined') {
			return value;
		}

		return transform(value, key, source);
	};
};

/**
 * Creator of transform functions for union types values
 * @template {TypeChecker<any>} T
 * @param {T[]} types
 * @param {ExtractTypeGuard<T>} initial
 * @returns {TransformFunction<ExtractTypeGuard<T>>}
 */
const useTypeOf = (types, initial) => {

	// Check for default value to be of a valid type
	if (!isTypeOf(types, initial)) {
		throw new TypeError('Invalid default value');
	}

	return (value) => {

		// Return the valid values or the default value
		if (isTypeOf(types, value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Creator of transform functions for input validation
 * @template {TypeChecker<any>} T
 * @param {T[]} types
 * @returns {TransformFunction<ExtractTypeGuard<T>>}
 */
const useValidation = (...types) => {

	// Validate provided types
	isTypeOf(types);

	return (value, key) => {

		// Throw for invalid type values
		if (!isTypeOf(types, value)) {
			throw new TypeError(`Property ${key} has invalid type`);
		}

		return value;
	};
};

module.exports = {
	isTypeOf,
	useOptional,
	useTypeOf,
	useValidation
};