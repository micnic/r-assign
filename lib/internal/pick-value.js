'use strict';

const { invalidRefineValue } = require('r-assign/lib/internal/invalid-type');
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

/**
 * @typedef {import('r-assign/lib/internal').TGM} TypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').OTTGM} ObjectTypeGuardMeta
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

	const meta = getTypeGuardMeta(type);

	// Loop through array elements and check for type match
	for (const element of value) {
		if (!isPrimitive(element) && element !== pickValue(element, meta)) {
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

	return value.map((element) => pickValue(element, getTypeGuardMeta(type)));
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

		return types.reduce((result, type) => ({
			...result,
			...pickValue(source, getTypeGuardMeta(type))
		}), initial);
	}

	return source;
};

/**
 * Check that the provided object matches the provided type
 * @param {Record<string, any>} value
 * @param {ObjectTypeGuardMeta} meta
 * @returns {boolean}
 */
const objectMatchesType = (value, meta) => {

	for (const key in value) {

		if (!meta.keys.includes(key)) {
			return false;
		}

		const prop = value[key];

		if (!isPrimitive(prop)) {

			const entry = [...meta.required, ...meta.optional].find(
				([entryKey]) => (entryKey === key)
			);

			if (entry && prop !== pickValue(prop, getTypeGuardMeta(entry[1]))) {
				return false;
			}
		}
	}

	return true;
};

/**
 * Clone source object
 * @param {Record<string, any>} value
 * @param {ObjectTypeGuardMeta} meta
 * @returns {Record<string, any>}
 */
const pickObject = (value, meta) => {

	// Check if the same value should be returned
	if (meta.same || objectMatchesType(value, meta)) {
		return value;
	}

	/** @type {any} */
	const result = {};

	for (const [key, type] of [...meta.required, ...meta.optional]) {

		// Check for primitive values
		if (isPrimitive(value[key])) {
			result[key] = value[key];
		} else {
			result[key] = pickValue(value[key], getTypeGuardMeta(type));
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
			element !== pickValue(element, getTypeGuardMeta(type))
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
		.map((type, index) => pickValue(value[index], getTypeGuardMeta(type)));
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
			return pickValue(value, getTypeGuardMeta(type));
		}
	}

	/* istanbul ignore next */
	throw TypeError(invalidUnionType);
};

/**
 * Clone provided value based on its type
 * @param {any} value
 * @param {TypeGuardMeta} meta
 * @returns {any}
 */
const pickValue = (value, meta) => {

	// Check for primitive value to return the value unchanged
	if (isPrimitive(value)) {
		return value;
	}

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
			return pickObject(value, meta);
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
 * Clone provided value and transform it if refine function is provided
 * @template T
 * @param {T} value
 * @param {TypeGuard<T>} type
 * @param {(value: T) => T} refine
 * @returns {T}
 */
const refineValue = (value, type, refine) => {

	const result = refine(value);

	// Check the result of the refine function call
	if (type(result)) {
		return result;
	}

	throw invalidRefineValue(type, value);
};

/**
 * Optimize data getting based on its type classification
 * @param {any} value
 * @param {TypeGuardMeta} meta
 * @returns {any}
 */
const takeValue = (value, meta) => {

	// Switch on type classification
	switch (meta.classification) {

		case 'any':
		case 'instance':
		case 'literal':
		case 'literals':
		case 'primitive':
		case 'template-literal': {
			return value;
		}

		default: {
			return pickValue(value, meta);
		}
	}
};

module.exports = {
	pickValue,
	refineValue,
	takeValue
};