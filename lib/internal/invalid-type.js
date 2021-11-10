'use strict';

const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @typedef {import('r-assign/lib').TC} TypeClassification
 */

/**
 * @typedef {import('r-assign/lib').TG} TypeGuard
 */

const { isArray } = Array;
const { isFinite } = Number;
const { entries, getPrototypeOf, keys } = Object;

/**
 * Get the prototype constructor of the provided value
 * @param {any} value
 * @returns {Function | null}
 */
const getConstructor = (value) => {

	const prototype = getPrototypeOf(value);

	// Check for available prototype and constructor
	if (prototype && prototype.constructor) {

		return prototype.constructor;
	}

	return null;
};

/**
 * Check for non-finite number
 * @param {any} value
 * @returns {value is number}
 */
const isNonFiniteNumber = (value) => {
	return (typeof value === 'number' && !isFinite(value));
};

/**
 * Check for a primitive value
 * @param {any} value
 * @returns {value is bigint | boolean | number | string | symbol | undefined}
 */
const isLiteralValue = (value) => {
	return (typeof value !== 'object' && typeof value !== 'function');
};

/**
 * Stringify any type
 * @param {any} data
 * @returns {string}
 */
const stringifyType = (data) => {

	/** @type {any[]} */
	const stack = [];

	/**
	 * Pop the last element from the stack and return its stringified value
	 * @param {string} entry
	 * @returns {string}
	 */
	const addEntry = (entry) => {

		// Remove last element from the stack
		stack.pop();

		return entry;
	};

	/**
	 * Stringify a value type and push it to the stack
	 * @param {any} value
	 * @returns {string}
	 */
	const stringify = (value) => {

		// Check for circular reference
		if (stack.includes(value)) {
			return addEntry('<Circular Reference>');
		}

		// Add the value to the stack
		stack.push(value);

		// Check for null
		if (value === null) {
			return addEntry('null');
		}

		// Check for arrays
		if (isArray(value)) {

			// Check for empty arrays
			if (value.length === 0) {
				return addEntry('[]');
			}

			/** @type {string[]} */
			const types = [];

			// Loop through the array elements
			for (const element of value) {

				const type = stringify(element);

				// Check for unique type
				if (!types.includes(type)) {
					types.push(type);
				}
			}

			// Check for array with elements of one type
			if (types.length === 1) {
				return addEntry(`${types[0]}[]`);
			}

			return addEntry(`(${types.join(' | ')})[]`);
		}

		// Check for objects
		if (typeof value === 'object') {

			const constructor = getConstructor(value);

			// Check for objects with constructors
			if (constructor) {

				// Check for Object constructor
				if (constructor === Object) {

					// Check for empty objects
					if (keys(value).length === 0) {
						return addEntry('{}');
					}

					const types = entries(value).map(([key, element]) => {
						return ` "${key}": ${stringify(element)};`;
					}).join(',\n');

					return addEntry(`{\n${types}\n}`);
				}

				return addEntry(constructor.name);
			}

			return addEntry(Object.name);
		}

		// Check for functions
		if (typeof value === 'function') {
			return addEntry(Function.name);
		}

		return addEntry(typeof value);
	};

	return stringify(data);
};

/**
 * Stringify the content of a tuple
 * @param {any[]} value
 * @returns {string}
 */
const stringifyTuple = (value) => {

	// Check for empty tuple
	if (value.length === 0) {
		return 'an empty tuple []';
	}

	return `a tuple of [ ${value.map(stringifyType).join(', ')} ]`;
};

/**
 *
 * @param {any} value
 * @param {TypeClassification} classification
 * @returns {string}
 */
const receivedType = (value, classification) => {

	const message = 'but received';

	// Check for literals, null, undefined and non-finite numbers
	if (
		value === null ||
		typeof value === 'undefined' ||
		isNonFiniteNumber(value) ||
		(classification === 'literal' && isLiteralValue(value))
	) {
		// Check for string literals
		if (typeof value === 'string') {
			return `${message} "${value}"`;
		}

		return `${message} ${String(value)}`;
	}

	const constructor = getConstructor(value);

	// Check for object instances
	if (typeof value === 'object' &&
		constructor &&
		constructor !== Object &&
		constructor !== Array
	) {
		return `${message} an instance of ${constructor.name}`;
	}

	// Check for array value
	if (isArray(value)) {

		// Check for tuple expectation
		if (classification === 'tuple') {
			return `${message} ${stringifyTuple(value)}`;
		}

		// Check for empty array
		if (value.length === 0) {
			return `${message} an empty array []`;
		}
	}

	return `${message} a value of type ${stringifyType(value)}`;
};

/**
 * Message for invalid property type error
 * @param {string} context
 * @param {TypeGuard} type
 * @param {any} value
 * @returns {string}
 */
const invalidType = (context, type, value) => {

	const { classification, description } = getTypeGuardMeta(type);
	const expected = `expected ${description}`;

	return `${context}, ${expected} ${receivedType(value, classification)}`;
};

/**
 * Message for invalid function arguments error
 * @param {TypeGuard} type
 * @param {any} value
 * @returns {string}
 */
const invalidFunctionArguments = (type, value) => {
	return invalidType('Invalid function arguments', type, value);
};

/**
 * Message for invalid function return error
 * @param {TypeGuard} type
 * @param {any} value
 * @returns {string}
 */
const invalidFunctionReturn = (type, value) => {
	return invalidType('Invalid function return', type, value);
};

/**
 * Message for invalid function return error
 * @param {any} value
 * @returns {string}
 */
const invalidFunctionVoidReturn = (value) => {

	const context = 'Invalid function return';

	return `${context}, expected void ${receivedType(value, 'function')}`;
};

/**
 * Message for invalid initial value type error
 * @param {TypeGuard} type
 * @param {any} value
 * @returns {string}
 */
const invalidInitialValue = (type, value) => {
	return invalidType('Invalid default value type', type, value);
};

/**
 * Message for invalid optional type
 * @param {string} context
 * @returns {string}
 */
const invalidOptionalType = (context) => {
	return `Optional type cannot be used in ${context} declaration`;
};

/**
 * Message for available property name
 * @param {string} [key]
 * @returns {string}
 */
const withKey = (key) => {

	// Check for provided key
	if (typeof key === 'string') {
		return ` for property "${key}"`;
	}

	return '';
};

/**
 * Message for invalid value type error
 * @param {TypeGuard} type
 * @param {any} value
 * @param {string} [key]
 * @returns {string}
 */
const invalidValue = (type, value, key) => {
	return invalidType(`Invalid value type${withKey(key)}`, type, value);
};

module.exports = {
	invalidFunctionArguments,
	invalidFunctionReturn,
	invalidFunctionVoidReturn,
	invalidInitialValue,
	invalidOptionalType,
	invalidValue
};