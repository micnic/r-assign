'use strict';

/**
 * @template T
 * @typedef {import('r-assign/lib/type').TypeChecker<T>} TypeChecker
 */

/**
 * @typedef {import('r-assign').TransformFunction} TransformFunction
 */

/**
 * @template {TypeChecker<any>} T
 * @typedef {T extends TypeChecker<infer U> ? U : never} ExtractTypeGuard
 */

/**
 * Check for values of union types
 * @template {TypeChecker<any>} T
 * @param {any} value
 * @param {T[]} types
 * @returns {value is ExtractTypeGuard<T>}
 */
const isTypeOf = (value, types) => {

	// Check for valid types provided
	if (!Array.isArray(types)) {
		throw new Error('Invalid type checks provided');
	}

	return types.some((type) => {

		// Check for valid specific type
		if (typeof type !== 'function') {
			throw new Error('Invalid type check provided');
		}

		const result = type(value);

		// Check for valid return value of type check
		if (typeof result !== 'boolean') {
			throw new Error('Invalid return value of type check');
		}

		return result;
	});
};

/**
 * Creator of transform functions for optional values
 * @template {TransformFunction} T
 * @param {T} transform
 * @returns {(...args: Parameters<T>) => ReturnType<T> | undefined}
 */
const useOptional = (transform) => {

	// Check for provided transform function
	if (typeof transform !== 'function') {
		throw new Error('Invalid transform function provided');
	}

	/**
	 * Transform function for optional values
	 * @param {any} value
	 * @param {string} key
	 * @param {any} source
	 * @returns {any}
	 */
	const result = (value, key, source) => {

		// Check for undefined values to accept them
		if (typeof value === 'undefined') {
			return value;
		}

		return transform(value, key, source);
	};

	return result;
};

/**
 * Creator of transform functions for union types values
 * @template {TypeChecker<any>} T
 * @param {ExtractTypeGuard<T>} initial
 * @param {T[]} types
 * @returns {(value: any) => ExtractTypeGuard<T>}
 */
const useTypeOf = (initial, types) => {

	// Check for default value to be of a valid type
	if (!isTypeOf(initial, types)) {
		throw new Error('Invalid default value');
	}

	/**
	 * Transform function for union types values
	 * @param {any} value
	 * @returns {ExtractTypeGuard<T>}
	 */
	const result = (value) => {

		// Return the valid values or the default value
		if (isTypeOf(value, types)) {
			return value;
		}

		return initial;
	};

	return result;
};

module.exports = {
	isTypeOf,
	useOptional,
	useTypeOf
};