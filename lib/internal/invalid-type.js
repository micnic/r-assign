'use strict';

const { hasOneElement } = require('r-assign/lib/internal/array-checks');
const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @typedef {import('r-assign/lib/internal').TC} TypeClassification
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
const isNonFiniteNumber = (value) => (
	typeof value === 'number' && !isFinite(value)
);

/**
 * Check for a primitive value
 * @param {string} kind
 * @returns {boolean}
 */
const isPrimitive = (kind) => (kind !== 'object' && kind !== 'function');

/**
 * Pop the last element from the stack and return its stringified value
 * @param {any[]} stack
 * @param {string} entry
 * @returns {string}
 */
const getEntry = (stack, entry) => {

	// Remove last element from the stack
	stack.pop();

	return entry;
};

/**
 * Stringify a value type and push it to the stack
 * @param {any[]} stack
 * @param {any} value
 * @returns {string}
 */
const stringifyPart = (stack, value) => {

	// Check for circular reference
	if (stack.includes(value)) {
		return getEntry(stack, '<Circular Reference>');
	}

	// Add the value to the stack
	stack.push(value);

	// Check for null
	if (value === null) {
		return getEntry(stack, 'null');
	}

	// Check for arrays
	if (isArray(value)) {

		// Check for empty arrays
		if (value.length === 0) {
			return getEntry(stack, '[]');
		}

		/** @type {string[]} */
		const types = [];

		// Loop through the array elements
		for (const element of value) {

			const type = stringifyPart(stack, element);

			// Check for unique type
			if (!types.includes(type)) {
				types.push(type);
			}
		}

		// Check for array with elements of one type
		if (hasOneElement(types)) {
			return getEntry(stack, `${types[0]}[]`);
		}

		return getEntry(stack, `(${types.join(' | ')})[]`);
	}

	const kind = typeof value;

	// Check for objects
	if (kind === 'object') {

		const constructor = getConstructor(value);

		// Check for objects with constructors
		if (constructor) {

			// Check for Object constructor
			if (constructor === Object) {

				// Check for empty objects
				if (keys(value).length === 0) {
					return getEntry(stack, '{}');
				}

				const indent = ' '.repeat(stack.length - 1);

				return getEntry(
					stack,
					`${indent}{\n${entries(value)
						.map(([key, element]) => {
							return `${indent} "${key}": ${stringifyPart(
								stack,
								element
							)};`;
						})
						.join('\n')}\n${indent}}`
				);
			}

			return getEntry(stack, constructor.name);
		}

		return getEntry(stack, Object.name);
	}

	// Check for functions
	if (kind === 'function') {
		return getEntry(stack, Function.name);
	}

	return getEntry(stack, kind);
};

/**
 * Stringify any type
 * @param {any} value
 * @returns {string}
 */
const stringifyValue = (value) => stringifyPart([], value);

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

	return `a tuple of [ ${value.map(stringifyValue).join(', ')} ]`;
};

/**
 * Received type message
 * @param {any} value
 * @param {TypeClassification} classification
 * @returns {string}
 */
const receivedType = (value, classification) => {

	const message = 'but received';
	const kind = typeof value;

	// Check for template literal and string values
	if (classification === 'template-literal' && kind === 'string') {
		return `${message} "${value}"`;
	}

	// Check for literals, null, undefined and non-finite numbers
	if (
		value === null ||
		value === undefined ||
		isNonFiniteNumber(value) ||
		(classification === 'literal' && isPrimitive(kind))
	) {
		// Check for string literals
		if (kind === 'string') {
			return `${message} "${value}"`;
		}

		return `${message} ${String(value)}`;
	}

	const constructor = getConstructor(value);

	// Check for object instances
	if (kind === 'object' &&
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

	return `${message} a value of type ${stringifyValue(value)}`;
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

	return `${context}, expected ${description} ${receivedType(
		value,
		classification
	)}`;
};

/**
 * Message for invalid function arguments error
 * @param {TypeGuard} type
 * @param {any} value
 * @returns {string}
 */
const invalidFunctionArguments = (type, value) =>
	invalidType('Invalid function arguments', type, value);

/**
 * Message for invalid function return error
 * @param {TypeGuard} type
 * @param {any} value
 * @returns {string}
 */
const invalidFunctionReturn = (type, value) =>
	invalidType('Invalid function return', type, value);

/**
 * Message for invalid function return error
 * @param {any} value
 * @returns {string}
 */
const invalidFunctionVoidReturn = (value) =>
	`Invalid function return, expected void ${receivedType(value, 'function')}`;

/**
 * Message for invalid initial value type error
 * @param {TypeGuard} type
 * @param {any} value
 * @returns {string}
 */
const invalidInitialValue = (type, value) =>
	invalidType('Invalid default value type', type, value);

/**
 * Message for invalid promise resolve error
 * @param {TypeGuard} type
 * @param {any} value
 * @returns {string}
 */
const invalidPromiseResolve = (type, value) =>
	invalidType('Invalid promise resolve', type, value);

/**
 * Message for invalid promise void resolve error
 * @param {any} value
 * @returns {string}
 */
const invalidPromiseVoidResolve = (value) =>
	`Invalid promise resolve, expected void ${receivedType(value, 'promise')}`;

/**
 * Message for invalid value after refine
 * @param {TypeGuard} type
 * @param {any} value
 * @returns {string}
 */
const invalidRefineValue = (type, value) =>
	invalidType('Invalid refine value type', type, value);

/**
 * Message for invalid optional type
 * @param {string} context
 * @returns {string}
 */
const invalidOptionalType = (context) =>
	`Optional type cannot be used in ${context} declaration`;

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
const invalidValue = (type, value, key) =>
	invalidType(`Invalid value type${withKey(key)}`, type, value);

module.exports = {
	invalidFunctionArguments,
	invalidFunctionReturn,
	invalidFunctionVoidReturn,
	invalidInitialValue,
	invalidOptionalType,
	invalidPromiseResolve,
	invalidPromiseVoidResolve,
	invalidRefineValue,
	invalidValue
};