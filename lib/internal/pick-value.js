'use strict';

const { invalidReplaceValue } = require('r-assign/lib/internal/invalid-type');
const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');
const { wrapFunction } = require('r-assign/lib/internal/wrap-function');

/**
 * @typedef {import('r-assign/lib').Intersection} Intersection
 */

/**
 * @template {Intersection} I
 * @typedef {import('r-assign/lib').InferInt<I>} InferIntersection
 */

/**
 * @typedef {import('r-assign/lib').Shape} Shape
 */

/**
 * @template {Shape} S
 * @template {TypeGuard<Record<keyof any, any>> | undefined} [M = undefined]
 * @typedef {import('r-assign/lib').InferS<S, M>} InferShape
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Tuple} Tuple
 */

/**
 * @template {Tuple} T
 * @typedef {import('r-assign/lib').InferT<T>} InferTuple
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').InferTG<T>} InferTypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Union} Union
 */

/**
 * @template {Union} U
 * @typedef {import('r-assign/lib').InferU<U>} InferUnion
 */

/**
 * @typedef {import('r-assign/lib/internal').TC} TypeClassification
 */

const invalidUnionType = 'Invalid union type provided';

/**
 * Check for primitive value
 * @param {any} value
 * @returns {boolean}
 */
const isPrimitive = (value) => {

	// Switch on value type
	switch (typeof value) {

		case 'function': {
			return false;
		}

		case 'object': {
			return (value === null);
		}

		default: {
			return true;
		}
	}
};

/**
 * Check that all array elements match the provided type
 * @template {TypeGuard} T
 * @param {InferTypeGuard<T>[]} value
 * @param {T} type
 * @returns {boolean}
 */
const arrayMatchesType = (value, type) => {

	// Loop through array elements and check for type match
	for (const element of value) {
		if (!isPrimitive(element) && element !== pickValue(element, type)) {
			return false;
		}
	}

	return true;
};

/**
 * Clone source array
 * @template {TypeGuard} T
 * @param {InferTypeGuard<T>[]} value
 * @param {T} type
 * @param {boolean} same
 * @returns {InferTypeGuard<T>[]}
 */
const pickArray = (value, type, same) => {

	// Check if the same value should be returned
	if (same || arrayMatchesType(value, type)) {
		return value;
	}

	return value.map((element) => pickValue(element, type));
};

/**
 * Clone source value based on the provided intersection type
 * @template {Intersection} I
 * @param {any} source
 * @param {I} types
 * @returns {any}
 */
const pickIntersection = (source, types) => {

	// Check for object value to assign its shape
	if (typeof source === 'object') {

		/** @type {any} */
		const initial = {};

		return types.reduce((result, type) => {
			return {
				...result,
				...pickValue(source, type)
			};
		}, initial);
	}

	return source;
};

/**
 * Check that the provided object matches the provided type
 * @param {Record<string, any>} value
 * @param {[string, TypeGuard][]} entries
 * @param {string[]} keys
 * @returns {boolean}
 */
const objectMatchesType = (value, entries, keys) => {

	for (const [key, prop] of Object.entries(value)) {

		if (!keys.includes(key)) {
			return false;
		}

		if (!isPrimitive(value[key])) {
			const entry = entries[keys.indexOf(key)];

			if (entry && prop !== pickValue(prop, entry[1])) {
				return false;
			}
		}
	}

	return true;
};

/**
 * Clone source object
 * @param {Record<string, any>} value
 * @param {[string, TypeGuard][]} entries
 * @param {string[]} keys
 * @param {boolean} same
 * @returns {Record<string, any>}
 */
const pickObject = (value, entries, keys, same) => {

	// Check if the same value should be returned
	if (same || objectMatchesType(value, entries, keys)) {
		return value;
	}

	/** @type {any} */
	const result = {};

	for (const [key, type] of entries) {

		// Check for primitive values
		if (isPrimitive(value[key])) {
			result[key] = value[key];
		} else {

			const meta = getTypeGuardMeta(type);

			// Check for optional type
			if (meta.classification === 'optional') {
				/* istanbul ignore else */
				if (meta.type(value[key])) {
					result[key] = pickValue(value[key], meta.type);
				}
			} else {
				result[key] = pickValue(value[key], type);
			}
		}
	}

	return result;
};

/**
 * Check that provided tuple matches the provided type
 * @param {any[]} value
 * @param {Tuple} tuple
 * @returns {boolean}
 */
const tupleMatchesType = (value, tuple) => {

	for (const [index, element] of value.entries()) {

		const type = tuple[index];

		if (
			!isPrimitive(element) &&
			type &&
			element !== pickValue(element, type)
		) {
			return false;
		}
	}

	return true;
};

/**
 * Clone source array
 * @param {any[]} value
 * @param {Tuple} tuple
 * @param {boolean} same
 * @returns {any[]}
 */
const pickTuple = (value, tuple, same) => {

	// Check if the same value should be returned
	if (same || tupleMatchesType(value, tuple)) {
		return value;
	}

	return tuple
		.slice(0, value.length)
		.map((type, index) => pickValue(value[index], type));
};

/**
 * Clone source value based on the provided union type
 * @template {Union} U
 * @param {any} value
 * @param {U} union
 * @returns {any}
 */
const pickUnion = (value, union) => {

	// Loop through union types to pick the first one that matches
	for (const type of union) {
		/* istanbul ignore else */
		if (type(value)) {
			return pickValue(value, type);
		}
	}

	/* istanbul ignore next */
	throw TypeError(invalidUnionType);
};

/**
 * Clone provided value based on its type
 * @param {any} value
 * @param {TypeGuard} type
 * @returns {any}
 */
const pickValue = (value, type) => {

	// Check for primitive value to return the value unchanged
	if (isPrimitive(value)) {
		return value;
	}

	const meta = getTypeGuardMeta(type);

	// Switch on type classification
	switch (meta.classification) {

		case 'array': {
			return pickArray(value, meta.type, meta.same);
		}

		case 'function': {
			return wrapFunction(value, meta.args, meta.result);
		}

		case 'intersection': {
			return pickIntersection(value, meta.types);
		}

		case 'object': {
			return pickObject(value, meta.entries, meta.keys, meta.same);
		}

		case 'tuple': {
			return pickTuple(value, meta.tuple, meta.same);
		}

		case 'union': {
			return pickUnion(value, meta.union);
		}

		default: {
			return value;
		}
	}
};

/**
 * Clone provided value and transform it if replace function is provided
 * @template T
 * @param {T} value
 * @param {TypeGuard<T>} type
 * @param {(value: T) => T} replace
 * @returns {T}
 */
const replaceValue = (value, type, replace) => {

	const result = replace(value);

	// Check the result of the replace function call
	if (type(result)) {
		return result;
	}

	throw invalidReplaceValue(type, value);
};

/**
 * Optimize data getting based on its type classification
 * @template {TypeGuard} T
 * @param {any} value
 * @param {T} type
 * @param {TypeClassification} classification
 * @returns {InferTypeGuard<T>}
 */
const takeValue = (value, type, classification) => {

	// Switch on type classification
	switch (classification) {

		case 'any':
		case 'instance':
		case 'literal':
		case 'literals':
		case 'primitive':
		case 'template-literal': {
			return value;
		}

		default: {
			return pickValue(value, type);
		}
	}
};

module.exports = {
	pickValue,
	replaceValue,
	takeValue
};