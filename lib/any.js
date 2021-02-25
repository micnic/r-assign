'use strict';

/**
 * @typedef {import('r-assign').TransformFunction} TransformFunction
 */

/**
 * Check for non-undefined values
 * @param {any} value
 * @returns {value is Exclude<any, undefined>}
 */
const isAny = (value) => {

	return (typeof value !== 'undefined');
};

/**
 * Creator of transform functions for non-undefined values
 * @param {any} [initial]
 * @returns {TransformFunction}
 */
const useAny = (initial) => {

	return (value) => {

		// Just return non-undefined values
		if (isAny(value)) {
			return value;
		}

		return initial;
	};
};

module.exports = {
	isAny,
	useAny
};