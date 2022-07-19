'use strict';

const { getType } = require('r-assign/lib/get-type');
const { invalidShape } = require('r-assign/lib/internal/errors');
const {
	checkInvalidOptional
} = require('r-assign/lib/internal/check-invalid-optional');
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
 * @typedef {import('r-assign/lib/internal').ObTGM} ObjectTypeGuardMeta
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
 * @template {TypeGuard<Record<keyof any, any>> | undefined} [M = undefined]
 * @param {ObjectTypeGuardMeta} meta
 * @param {any} value
 * @param {boolean} strict
 * @param {M} [mapping]
 * @returns {boolean}
 */
const checkObjectShape = (meta, value, strict, mapping) => {

	// Check for non-object values
	if (value === null || typeof value !== 'object') {
		return false;
	}

	const result = meta.entries.every(([ key, type ]) => {

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
		return keys(value).every((key) => meta.keys.includes(key));
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

	/** @type {ObjectTypeGuardMeta} */
	const meta = {
		annotation,
		classification: 'object',
		description: `an object of shape ${annotation}`,
		entries: entries(shape),
		keys: keys(shape),
		mapping,
		strict: false
	};

	/** @type {TypeGuard<InferShape<S, M>>} */
	const check = (value) => checkObjectShape(meta, value, false, mapping);

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

	const annotation = getObjectAnnotation(shape);

	/** @type {ObjectTypeGuardMeta} */
	const meta = {
		annotation,
		classification: 'object',
		description: `an object of strict shape ${annotation}`,
		entries: entries(shape),
		keys: keys(shape),
		strict: true
	};

	/** @type {TypeGuard<InferShape<S>>} */
	const check = (value) => checkObjectShape(meta, value, true);

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