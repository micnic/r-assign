'use strict';

const invalidDefaultValue = 'Invalid default value, boolean expected';

/**
 * Creator of transform functions for boolean values
 * @param {boolean} [initial]
 * @returns {(value: any) => boolean}
 */
const useBoolean = (initial = false) => {

	// Check for default value to be a boolean
	if (typeof initial !== 'boolean') {
		throw TypeError(invalidDefaultValue);
	}

	/**
	 * Transform function for boolean values
	 * @param {any} value
	 * @returns {boolean}
	 */
	const result = (value) => {

		// Just return boolean values
		if (typeof value === 'boolean') {
			return value;
		}

		return initial;
	};

	return result;
};

module.exports = useBoolean;