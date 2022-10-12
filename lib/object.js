'use strict';

const { getType } = require('r-assign/lib/get-type');
const { invalidShape } = require('r-assign/lib/internal/errors');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
const { parseType } = require('r-assign/lib/parse-type');

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
 * @typedef {import('r-assign/lib/internal').SE} ShapeEntries
 */

/**
 * @typedef {import('r-assign/lib/internal').OTTGM} ObjectTypeGuardMeta
 */

/**
 * @template {Shape} S
 * @template {TypeGuard<Record<keyof any, any>> | undefined} [M = undefined]
 * @typedef {import('r-assign/lib').InferS<S, M>} InferShape
 */

const { entries, keys } = Object;
const { hasOwnProperty } = Object.prototype;

const invalidMapping = 'Invalid object mapping provided';

/**
 * Determines whether an object has a property with the specified name
 * @template {Record<string, any>} T
 * @param {T} object
 * @param {string} key
 * @returns {key is keyof T}
 */
const hasOwn = (object, key) => hasOwnProperty.call(object, key);

/**
 * Check for object shape
 * @param {ObjectTypeGuardMeta} meta
 * @param {any} value
 * @returns {boolean}
 */
const checkObjectShape = (meta, value) => {

	// Check for non-object values
	if (value === null || typeof value !== 'object') {
		return false;
	}

	for (const [key, type] of meta.required) {
		if (!hasOwn(value, key) || !type(value[key])) {
			return false;
		}
	}

	for (const [key, type] of meta.optional) {
		if (hasOwn(value, key) && !type(value[key])) {
			return false;
		}
	}

	// Check for strict object validation
	if (meta.strict) {

		// Check for unrecognized keys
		for (const key of keys(value)) {
			if (!meta.keys.includes(key)) {
				return false;
			}
		}

		return true;
	}

	// Check for object mapping
	if (meta.mapping) {
		return meta.mapping(value);
	}

	return true;
};

/**
 * Get object description from the provided annotation and strict flag
 * @param {string} annotation
 * @param {boolean} strict
 */
const getObjectDescription = (annotation, strict) => {

	// Check for strict object
	if (strict) {
		return `an object of strict shape ${annotation}`;
	}

	return `an object of shape ${annotation}`;
};

/**
 * Create object type guard meta
 * @template {Shape} S
 * @template {TypeGuard<Record<keyof any, any>> | undefined} [M = undefined]
 * @param {S} shape
 * @param {boolean} strict
 * @param {M} [mapping]
 * @returns {ObjectTypeGuardMeta}
 */
const createObjectMeta = (shape, strict, mapping) => {

	const annotation = getObjectAnnotation(shape, mapping);

	const all = entries(shape).sort(
		([ first ], [ second ]) => first.localeCompare(second)
	);

	const required = all.filter((entry) => {

		const meta = getTypeGuardMeta(entry[1]);

		return (meta.classification !== 'optional');
	});

	const optional = all.filter((entry) => {

		const meta = getTypeGuardMeta(entry[1]);

		return (meta.classification === 'optional');
	});

	return {
		annotation,
		classification: 'object',
		description: getObjectDescription(annotation, strict),
		keys: keys(shape),
		mapping,
		optional,
		required,
		same: false,
		strict
	};
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

	const meta = createObjectMeta(shape, false, mapping);

	/** @type {TypeGuard<InferShape<S, M>>} */
	const check = (value) => checkObjectShape(meta, value);

	// Save type guard meta
	setTypeGuardMeta(check, meta);

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

	const meta = createObjectMeta(shape, true);

	/** @type {TypeGuard<InferShape<S>>} */
	const check = (value) => checkObjectShape(meta, value);

	// Save type guard meta
	setTypeGuardMeta(check, meta);

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
const getObjectOf = (shape, initial) => getType(isObjectOf(shape), initial);

/**
 * Extract strict object values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @template {Shape} S
 * @param {S} shape
 * @param {InferShape<S>} initial
 * @returns {TransformFunction<InferShape<S>>}
 */
const getStrictObjectOf = (shape, initial) =>
	getType(isStrictObjectOf(shape), initial);

/**
 * Extract and validate object values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<InferShape<S>>}
 */
const parseObjectOf = (shape) => parseType(isObjectOf(shape));

/**
 * Extract and validate strict object values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @template {Shape} S
 * @param {S} shape
 * @returns {TransformFunction<InferShape<S>>}
 */
const parseStrictObjectOf = (shape) => parseType(isStrictObjectOf(shape));

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