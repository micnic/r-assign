'use strict';

const {
	checkInvalidOptional
} = require('r-assign/lib/internal/check-invalid-optional');
const {
	invalidInitialValue,
	invalidValue
} = require('r-assign/lib/internal/invalid-type');
const {
	forEvery,
	forEveryKey,
	hasOwn
} = require('r-assign/lib/internal/object-utils');
const { pickObject } = require('r-assign/lib/internal/pick-value');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Shape} Shape
 */

/**
 * @template {Shape} S
 * @template {TypeGuard<Record<keyof any, any>> | undefined} [M = undefined]
 * @typedef {import('r-assign/lib').InferShape<S, M>} InferShape
 */

const { entries, keys } = Object;

const invalidMapping = 'Invalid object mapping provided';
const invalidShape = 'Invalid shape provided';

/**
 * Check for object shape
 * @template {Shape} S
 * @template {TypeGuard<Record<keyof any, any>> | undefined} [M = undefined]
 * @param {S} shape
 * @param {any} value
 * @param {boolean} strict
 * @param {M} [mapping]
 * @returns {boolean}
 */
const checkObjectShape = (shape, value, strict, mapping) => {

	// Check for non-object values
	if (value === null || typeof value !== 'object') {
		return false;
	}

	const result = forEvery(shape, (type, key) => {

		const property = value[key];

		// Check property type
		if (
			(hasOwn(value, key) && checkInvalidOptional(type, property)) ||
			!type(property)
		) {
			return false;
		}

		return true;
	});

	// Check for strict object validation
	if (strict && result) {
		return forEveryKey(value, (key) => hasOwn(shape, key));
	}

	// Check for object mapping
	if (mapping && result) {
		return mapping(value);
	}

	return result;
};

/**
 * Get object annotation from the provided shape
 * @template {TypeGuard<Record<keyof any, any>> | undefined} [M = undefined]
 * @param {M} [mapping]
 * @returns {string}
 */
const getObjectMappingAnnotation = (mapping) => {

	// Check for no or empty mapping
	if (!mapping) {
		return '';
	}

	const meta = getTypeGuardMeta(mapping);

	// Switch on mapping classification
	switch (meta.classification) {

		case 'object': {

			// Check for strict object to invalidate the mapping
			if (meta.strict) {
				throw TypeError(invalidMapping);
			}

			return meta.annotation.slice(1 + 1, -1);
		}

		case 'record': {

			const keyType = getTypeGuardMeta(meta.keys).annotation;
			const valueType = getTypeGuardMeta(meta.values).annotation;

			return ` [x: ${keyType}]: ${valueType};\n`;
		}

		default: {
			throw TypeError(invalidMapping);
		}
	}
};

/**
 * Get object annotation from the provided shape
 * @template {Shape} S
 * @template {TypeGuard<Record<keyof any, any>> | undefined} M
 * @param {S} shape
 * @param {M} [mapping]
 * @returns {string}
 */
const getObjectAnnotation = (shape, mapping) => {

	const mappingAnnotation = getObjectMappingAnnotation(mapping);

	// Check for empty shape
	if (keys(shape).length === 0) {

		// Check for mapping to display it if available
		if (mappingAnnotation) {
			return `{\n${mappingAnnotation}}`;
		}

		return '{}';
	}

	return `{\n${mappingAnnotation}${entries(shape)
		.map(([key, type]) => {
			const { annotation, classification } = getTypeGuardMeta(type);

			// Check for optional type guard
			if (classification === 'optional') {
				return ` "${key}"?: ${annotation};\n`;
			}

			return ` "${key}": ${annotation};\n`;
		}).join('')}}`;
};

/**
 * Check for object values
 * @template {Shape} S
 * @template {TypeGuard<Record<keyof any, any>> | undefined} [M = undefined]
 * @param {S} shape
 * @param {M} [mapping]
 * @returns {TypeGuard<InferShape<S, M>>}>}
 */
const isObjectOf = (shape, mapping) => {

	// Check for non-object shapes
	if (shape === null || typeof shape !== 'object') {
		throw TypeError(invalidShape);
	}

	const annotation = getObjectAnnotation(shape, mapping);

	/** @type {TypeGuard<InferShape<S, M>>} */
	const check = (value) => checkObjectShape(shape, value, false, mapping);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'object',
		description: `an object of shape ${annotation}`,
		main: check,
		mapping,
		shape,
		strict: false
	});

	return check;
};

/**
 * Check for strict object values
 * @template {Shape} S
 * @param {S} shape
 * @returns {TypeGuard<InferShape<S>>}
 */
const isStrictObjectOf = (shape) => {

	// Check for non-object shapes
	if (shape === null || typeof shape !== 'object') {
		throw TypeError(invalidShape);
	}

	const annotation = getObjectAnnotation(shape);

	/** @type {TypeGuard<InferShape<S>>} */
	const check = (value) => checkObjectShape(shape, value, true);

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'object',
		description: `an object of strict shape ${annotation}`,
		main: check,
		shape,
		strict: true
	});

	return check;
};

/**
 * Extract object values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {Shape} S
 * @param {S} shape
 * @param {InferShape<S>} initial
 * @returns {TransformFunction<InferShape<S>>}
 */
const getObjectOf = (shape, initial) => {

	const check = isObjectOf(shape);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw TypeError(invalidInitialValue(check, initial));
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return pickObject(value, shape);
		}

		return pickObject(initial, shape);
	};
};

/**
 * Extract strict object values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {Shape} S
 * @param {S} shape
 * @param {InferShape<S>} initial
 * @returns {TransformFunction<InferShape<S>>}
 */
const getStrictObjectOf = (shape, initial) => {

	const check = isStrictObjectOf(shape);

	// Check for default value to be of a valid type
	if (!check(initial)) {
		throw TypeError(invalidInitialValue(check, initial));
	}

	return (value) => {

		// Return the valid values or the default value
		if (check(value)) {
			return { ...value };
		}

		return { ...initial };
	};
};

/**
 * Extract and validate object values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<InferShape<S>>}
 */
const parseObjectOf = (shape) => {

	const check = isObjectOf(shape);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidValue(check, value, key));
		}

		return pickObject(value, shape);
	};
};

/**
 * Extract and validate strict object values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<InferShape<S>>}
 */
const parseStrictObjectOf = (shape) => {

	const check = isStrictObjectOf(shape);

	return (value, key) => {

		// Throw for invalid type values
		if (!check(value)) {
			throw TypeError(invalidValue(check, value, key));
		}

		return { ...value };
	};
};

module.exports = {
	getObjectOf,
	getStrictObjectOf,
	isObjectOf,
	isStrictObjectOf,
	object: isObjectOf,
	parseObjectOf,
	parseStrictObjectOf,
	strictObject: isStrictObjectOf
};