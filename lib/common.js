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
 * @returns {any}
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
 * Check for non-empty array
 * @param {any} value
 * @returns {value is [any, ...any[]]}
 */
const isNonEmptyArray = (value) => {
	return (
		isArray(value) &&
		getConstructor(value) === Array &&
		value.length > 0
	);
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
 * Check for an object instance
 * @param {any} value
 * @returns {value is any}
 */
const isObjectInstance = (value) => {

	const constructor = getConstructor(value);

	return (
		typeof value === 'object' &&
		!isArray(value) &&
		constructor &&
		constructor !== Object
	);
};

/**
 * Check for a primitive value
 * @param {any} value
 * @returns {value is bigint | boolean | number | string | symbol | undefined}
 */
const isPrimitive = (value) => {
	return (
		typeof value !== 'object' ||
		typeof value !== 'function'
	);
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
 * @param {any} value
 * @returns {string}
 */
const stringifyType = (value) => {

	const type = typeof value;

	if (value === null) {

		return 'null';
	}

	if (type === 'function') {

		return Function.name;
	}

	if (type === 'object') {

		const constructor = getConstructor(value);

		if (isArray(value) && constructor === Array) {

			if (value.length === 0) {
				return '[]';
			}

			const types = value.map(stringifyType).filter(uniqueElement);

			if (types.length === 1) {
				return `${types[0]}[]`;
			}

			return `(${types.join(' | ')})[]`;
		}

		if (constructor) {
			if (constructor === Object) {

				if (keys(value).length === 0) {
					return '{}';
				}

				return `{\n${entries(value).map(([key, element]) => {
					return `"${key}": ${stringifyType(element)}`;
				}).join(',\n')}\n}`;
			}

			return constructor.name;
		}

		return Object.name;
	}

	return type;
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

	const { annotation, classification, description } = getTypeGuardMeta(type);
	const valueType = typeof value;

	let message = '';

	if (initial) {
		message += 'Invalid default value type';
	} else {
		message += 'Invalid value type';
	}

	if (name) {
		message += ` for property "${name}"`;
	}

	if (annotation === 'any') {
		return `${message}, expected ${description}`;
	}

	message += `, expected ${description} but received `;

	if (value === null ||
		valueType === 'undefined' ||
		isNonFiniteNumber(value) ||
		(classification === 'literal' && isPrimitive(value))) {
		return `${message}${String(value)}`;
	}

	const constructor = getConstructor(value);

	if (isObjectInstance(value)) {
		return `${message}an instance of ${constructor.name}`;
	}

	message += 'a value of type ';

	if (classification === 'tuple' && isNonEmptyArray(value)) {
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