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
 * @typedef {import('r-assign/lib/internal').ATGM} ArrayTypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').OTTGM} ObjectTypeGuardMeta
 */

/**
 * @typedef {import('r-assign/lib/internal').TTGM} TupleTypeGuardMeta
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
 * @param {any[]} value
 * @param {TypeGuardMeta} meta
 * @returns {boolean}
 */
const arrayMatchesType = (value, meta) => {

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
 * @param {any[]} value
 * @param {ArrayTypeGuardMeta} meta
 * @returns {any[]}
 */
const pickArray = (value, meta) => {

	// Check if the same value should be returned
	if (meta.same || arrayMatchesType(value, meta.child)) {
		return value;
	}

	return value.map((element) =>
		pickValue(element, meta.child)
	);
};

/**
 * Clone source value based on the provided intersection type
 * @param {any} source
 * @param {TypeGuardMeta[]} metas
 * @returns {any}
 */
const pickIntersection = (source, metas) => {

	// Check for object value to assign its shape
	if (typeof source === 'object') {

		/** @type {any} */
		const initial = {};

		return metas.reduce(
			(result, meta) => ({
				...result,
				...pickValue(source, meta)
			}),
			initial
		);
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
 * @param {TupleTypeGuardMeta} meta
 * @returns {boolean}
 */
const tupleMatchesType = (value, meta) => {

	const { indexes, tuple } = meta;
	const { required, rest } = indexes;

	// Check for empty tuple value
	if (value.length === 0) {
		return true;
	}

	return value.every((element, index) => {

		// Check for primitive elements
		if (isPrimitive(element)) {
			return true;
		}

		// Check for rest elements
		if (rest >= 0 && index >= rest) {

			// Check for required elements after rest
			if (required > rest && index > value.length - tuple.length + rest) {

				const type = tuple[tuple.length + index - value.length];

				return (
					type &&
					element === pickValue(element, getTypeGuardMeta(type))
				);
			}

			const type = tuple[rest];

			/* istanbul ignore else */
			if (type) {

				const child = getTypeGuardMeta(type);

				/* istanbul ignore else */
				if (child.classification === 'rest') {
					return (
						element ===
						pickValue(element, getTypeGuardMeta(child.type))
					);
				}
			}

			/* istanbul ignore next */
			throw TypeError('Invalid tuple type');
		}

		const type = tuple[index];

		return (type && element === pickValue(element, getTypeGuardMeta(type)));
	});
};

/**
 * Clone source tuple
 * @param {any[]} value
 * @param {TupleTypeGuardMeta} meta
 * @returns {any[]}
 */
const pickTuple = (value, meta) => {

	// Check if the same value should be returned
	if (meta.same || tupleMatchesType(value, meta)) {
		return value;
	}

	const { indexes, tuple } = meta;
	const { required, rest } = indexes;

	return value.map((element, index) => {

		// Check for primitive elements
		if (isPrimitive(element)) {
			return element;
		}

		// Check for rest elements
		if (rest >= 0 && index >= rest) {

			// Check for required elements after rest
			if (required > rest && index > value.length - tuple.length + rest) {

				const type = tuple[tuple.length + index - value.length];

				return (type && pickValue(element, getTypeGuardMeta(type)));
			}

			const type = tuple[rest];

			/* istanbul ignore next */
			if (!type) {
				throw TypeError('Invalid tuple type');
			}

			const child = getTypeGuardMeta(type);

			/* istanbul ignore else */
			if (child.classification === 'rest') {
				return pickValue(element, getTypeGuardMeta(child.type));
			}

			/* istanbul ignore next */
			throw TypeError('Invalid tuple type');
		}

		const type = tuple[index];

		/* istanbul ignore next */
		if (!type) {
			throw TypeError('Invalid tuple type');
		}

		return pickValue(element, getTypeGuardMeta(type));
	});
};

/**
 * Clone source value based on the provided union type
 * @param {any} value
 * @param {Union} union
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
			return pickArray(value, meta);
		}

		case 'function': {
			return wrapFunction(value, meta.input, meta.output);
		}

		case 'intersection': {
			return pickIntersection(value, meta.children);
		}

		case 'object': {
			return pickObject(value, meta);
		}

		case 'tuple': {
			return pickTuple(value, meta);
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