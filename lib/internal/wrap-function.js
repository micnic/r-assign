'use strict';

const {
	invalidFunctionArguments,
	invalidFunctionReturn,
	invalidFunctionVoidReturn
} = require('r-assign/lib/internal/invalid-type');

/**
 * @template A
 * @template R
 * @typedef {import('r-assign/lib').InferFunction<A, R>} InferFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Tuple} Tuple
 */

/**
 * Get function annotation
 * @template {TypeGuard<any>} A
 * @template {TypeGuard<any>} R
 * @param {((...args: any[]) => any)} fn
 * @param {A} args
 * @param {R} [result]
 * @returns {InferFunction<A, R>}
 */
const wrapFunction = (fn, args, result) => {

	return (...input) => {

		// Check for valid function arguments
		if (!args(input)) {
			throw TypeError(invalidFunctionArguments(args, input));
		}

		const output = fn(...input);

		// Check for valid function return in case return type is provided
		if (result && !result(output)) {
			throw TypeError(invalidFunctionReturn(result, output));
		}

		// Check for valid function return in case return type is void
		if (!result && typeof output !== 'undefined') {
			throw TypeError(invalidFunctionVoidReturn(output));
		}

		return output;
	};
};

module.exports = { wrapFunction };