'use strict';

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
 * @returns {(value: any) => any}
 */
const useAny = (initial) => {

	/**
	 * Transform function for any values
	 * @param {any} value
	 * @returns {any}
	 */
	const result = (value) => {

		// Just return non-undefined values
		if (isAny(value)) {
			return value;
		}

		return initial;
	};

	return result;
};

module.exports = {
	isAny,
	useAny
};