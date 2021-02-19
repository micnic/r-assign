'use strict';

/**
 * Creator of transform functions for any values
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
		if (typeof value !== 'undefined') {
			return value;
		}

		return initial;
	};

	return result;
};

module.exports = useAny;