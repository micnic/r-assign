'use strict';

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

const invalidUnionType = 'Invalid union type provided';

/**
 * Clone source array
 * @template {TypeGuard} T
 * @param {InferTypeGuard<T>[]} value
 * @param {T} type
 * @returns {InferTypeGuard<T>[]}
 */
const pickArray = (value, type) => {

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
 * Clone source object
 * @param {Record<string, any>} value
 * @param {[string, TypeGuard][]} entries
 * @returns {Record<string, any>}
 */
const pickObject = (value, entries) => {

	/** @type {any} */
	const result = {};

	// Populate result object
	entries.forEach(([key, type]) => {

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
	});

	return result;
};

/**
 * Clone source array
 * @template {Tuple} T
 * @param {any[]} value
 * @param {T} tuple
 * @returns {any[]}
 */
const pickTuple = (value, tuple) =>
	tuple.slice(0, value.length)
		.map((type, index) => pickValue(value[index], type));

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

	const kind = typeof value;

	// Check for primitive value to return the value unchanged
	if ((kind !== 'object' && kind !== 'function') || value === null) {
		return value;
	}

	const meta = getTypeGuardMeta(type);

	// Switch on type classification
	switch (meta.classification) {

		case 'array': {
			return pickArray(value, meta.type);
		}

		case 'function': {
			return wrapFunction(value, meta.args, meta.result);
		}

		case 'intersection': {
			return pickIntersection(value, meta.types);
		}

		case 'object': {
			return pickObject(value, meta.entries);
		}

		case 'tuple': {
			return pickTuple(value, meta.tuple);
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
 * @param {(value: T) => T} [replace]
 * @returns {T}
 */
const replaceValue = (value, type, replace) => {

	// Check for replace function
	if (replace) {
		return replace(pickValue(value, type));
	}

	return pickValue(value, type);
};

module.exports = {
	replaceValue
};