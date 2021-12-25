'use strict';

const { hasOwn } = require('r-assign/lib/internal/has-own');
const { getTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');
const { wrapFunction } = require('r-assign/lib/internal/wrap-function');

/**
 * @template {Intersection} I
 * @typedef {import('r-assign/lib').InferIntersection<I>} InferIntersection
 */

/**
 * @template {Shape} S
 * @typedef {import('r-assign/lib').InferShape<S>} InferShape
 */

/**
 * @template {Tuple} T
 * @typedef {import('r-assign/lib').InferTuple<T>} InferTuple
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').InferTypeGuard<T>} InferTypeGuard
 */

/**
 * @template {Union} U
 * @typedef {import('r-assign/lib').InferUnion<U>} InferUnion
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Intersection} Intersection
 */

/**
 * @typedef {import('r-assign/lib').Shape} Shape
 */

/**
 * @typedef {import('r-assign/lib').Tuple} Tuple
 */

/**
 * @typedef {import('r-assign/lib').Union} Union
 */

const invalidUnionType = 'Invalid union type provided';

/**
 * Clone source array
 * @template {TypeGuard} T
 * @param {InferTypeGuard<T>[]} source
 * @param {T} type
 * @returns {InferTypeGuard<T>[]}
 */
const pickArray = (source, type) => {

	return source.map((element) => pickValue(element, type));
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

		/** @type {any} */ // TODO: find a way to replace with a specific type
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
 * @template {Shape} S
 * @param {InferShape<S>} source
 * @param {S} shape
 * @returns {InferShape<S>}
 */
const pickObject = (source, shape) => {

	/** @type {any} */ // TODO: find a way to replace with a specific type
	const result = {};

	// Loop through shape properties to pick them
	for (const key in shape) {

		// Check for own property in shape and source
		if (hasOwn(shape, key) && hasOwn(source, key)) {

			const type = shape[key];
			const meta = getTypeGuardMeta(type);

			// Check for optional type
			if (meta.classification === 'optional') {
				/* istanbul ignore else */
				if (meta.type(source[key])) {
					result[key] = pickValue(source[key], meta.type);
				}
			} else {
				result[key] = pickValue(source[key], type);
			}
		}
	}

	return result;
};

/**
 * Clone source array
 * @template {Tuple} T
 * @param {any} source
 * @param {T} tuple
 * @returns {any}
 */
const pickTuple = (source, tuple) => {

	return tuple.slice(0, source.length).map((type, index) => {
		return pickValue(source[index], type);
	});
};

/**
 * Clone source value based on the provided union type
 * @template {Union} U
 * @param {any} source
 * @param {U} union
 * @returns {any}
 */
const pickUnion = (source, union) => {

	// Loop through union types to pick the first one that matches
	for (const type of union) {
		if (type(source)) {
			return pickValue(source, type);
		}
	}

	/* istanbul ignore next */
	throw TypeError(invalidUnionType);
};

/**
 * Clone provided value based on its type
 * @template {TypeGuard} T
 * @param {any} value
 * @param {T} type
 * @returns {any}
 */
const pickValue = (value, type) => {

	const meta = getTypeGuardMeta(type);
	const { classification } = meta;

	// Switch on type classification
	switch (classification) {

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
			return pickObject(value, meta.shape);
		}

		case 'tuple': {
			return pickTuple(value, meta.types);
		}

		case 'union': {
			return pickUnion(value, meta.types);
		}

		default: {
			return value;
		}
	}
};

module.exports = {
	pickArray,
	pickIntersection,
	pickObject,
	pickTuple,
	pickUnion,
	pickValue,
	wrapFunction
};