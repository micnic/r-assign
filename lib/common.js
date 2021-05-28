'use strict';

/**
 * @typedef {import('r-assign/lib').TypeGuard} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib').TypeGuardMeta} TypeGuardMeta
 */

const { isArray } = Array;
const { isFinite } = Number;
const { entries, getPrototypeOf, keys } = Object;

const invalidTypeGuard = 'Invalid type guard provided';

/**
 * @type {WeakMap<TypeGuard, TypeGuardMeta>}
 */
const typeGuardMeta = new WeakMap();

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
 * Extract type guard meta
 * @param {TypeGuard} type
 * @returns {TypeGuardMeta}
 */
const getTypeGuardMeta = (type) => {

	const meta = typeGuardMeta.get(type);

	// Validate type guard meta
	if (!meta) {
		throw TypeError(invalidTypeGuard);
	}

	return meta;
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
const isPrimitive = (value) => {
	return (typeof value !== 'object' && typeof value !== 'function');
};

/**
 * Predicate to get an array with unique elements
 * @param {string} element
 * @param {number} index
 * @param {string[]} array
 * @returns {boolean}
 */
const uniqueElement = (element, index, array) => {
	return (array.indexOf(element) === index);
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
	 * Stringify a value type and push it to the stack
	 * @param {any} value
	 * @returns {string}
	 */
	const stringify = (value) => {

		const type = typeof value;

		try {

			// Check for circular reference
			if (stack.includes(value)) {
				return '<Circular Reference>';
			}

			// Add the value to the stack
			stack.push(value);

			// Check for null
			if (value === null) {
				return 'null';
			}

			// Check for functions
			if (type === 'function') {
				return Function.name;
			}

			// Check for arrays
			if (isArray(value)) {

				// Check for empty arrays
				if (value.length === 0) {
					return '[]';
				}

				const types = value.map(stringify).filter(uniqueElement);

				// Check for array with elements of one type
				if (types.length === 1) {
					return `${types[0]}[]`;
				}

				return `(${types.join(' | ')})[]`;
			}

			// Check for objects
			if (type === 'object') {

				const constructor = getConstructor(value);

				// Check for objects with constructors
				if (constructor) {

					// Check for Object constructor
					if (constructor === Object) {

						// Check for empty objects
						if (keys(value).length === 0) {
							return '{}';
						}

						return `{\n${entries(value).map(([key, element]) => {
							return ` "${key}": ${stringify(element)};`;
						}).join(',\n')}\n}`;
					}

					return constructor.name;
				}

				return Object.name;
			}

			return type;
		} finally {
			stack.pop();
		}
	};

	return stringify(data);
};

/**
 * Stringify the content of a tuple
 * @param {any[]} value
 * @returns {string}
 */
const stringifyTuple = (value) => {

	return `[ ${value.map(stringifyType).join(', ')} ]`;
};

/**
 * Returns message for invalid property type error
 * @param {TypeGuard} type
 * @param {boolean} initial
 * @param {any} value
 * @param {string} [name]
 * @returns {string}
 */
const invalidPropertyType = (type, initial, value, name) => {

	const { classification, description } = getTypeGuardMeta(type);

	let message = '';

	// Check for default value
	if (initial) {
		message += 'Invalid default value type';
	} else {
		message += 'Invalid value type';
	}

	// Check for property name
	if (name) {
		message += ` for property "${name}"`;
	}

	// Add description of the expected type
	message += `, expected ${description} but received `;

	// Check for literals, null, undefined and non-finite numbers
	if (value === null ||
		typeof value === 'undefined' ||
		isNonFiniteNumber(value) ||
		(classification === 'literal' && isPrimitive(value))
	) {

		// Check for string literals
		if (typeof value === 'string') {
			return `${message}"${value}"`;
		}

		return `${message}${String(value)}`;
	}

	const constructor = getConstructor(value);

	// Check for object instances
	if (typeof value === 'object' &&
		constructor &&
		constructor !== Object &&
		constructor !== Array
	) {
		return `${message}an instance of ${constructor.name}`;
	}

	// Add message for general types
	message += 'a value of type ';

	// Check for tuple expectation and array input
	if (classification === 'tuple' && isArray(value) && value.length > 0) {
		return `${message}${stringifyTuple(value)}`;
	}

	return `${message}${stringifyType(value)}`;
};

/**
 * Save type guard meta
 * @param {TypeGuard} type
 * @param {TypeGuardMeta} meta
 */
const setTypeGuardMeta = (type, meta) => {
	typeGuardMeta.set(type, meta);
};

module.exports = {
	getTypeGuardMeta,
	invalidPropertyType,
	setTypeGuardMeta
};