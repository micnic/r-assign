import { hasAtLeastOneElement } from './internal/array-checks.js';
import { invalidShape } from './internal/errors.js';
import {
	getTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isLiteralOf } from 'r-assign/literal';
import { isNever } from 'r-assign/never';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign').Shape} Shape
 */

/**
 * @typedef {import('./internal/index.js').SE} ShapeEntries
 */

/**
 * @typedef {import('./internal/index.js').OTTGM} ObjectTypeGuardMeta
 */

/**
 * @template {Shape} S
 * @template {TypeGuard<Record<keyof any, any>> | undefined} [M = undefined]
 * @typedef {import('r-assign').InferS<S, M>} InferShape
 */

const { isArray } = Array;
const { entries, fromEntries, keys } = Object;
const { hasOwnProperty } = Object.prototype;

const expectedKeys = 'expected strings or array of strings';
const invalidKeysType = `Invalid keys provided, ${expectedKeys}`;
const invalidObjectType = 'Invalid type provided, expected an object type';
const invalidMapping = 'Invalid object mapping provided';

/**
 * Determines whether an object has a property with the specified name
 * @template {Record<string, any>} R
 * @param {R} object
 * @param {string} key
 * @returns {key is keyof R}
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

	// Check the required properties
	for (const [key, type] of meta.required) {
		if (!hasOwn(value, key) || !type(value[key])) {
			return false;
		}
	}

	// Check the optional properties
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
 * Check for keys of provided object type
 * @template {Record<keyof any, any>} R
 * @param {TypeGuard<R>} type
 * @returns {TypeGuard<keyof R>}
 */
export const isKeyOf = (type) => {

	const meta = getTypeGuardMeta(type);

	// Check for object type guard
	if (meta.classification !== 'object') {
		throw TypeError(invalidObjectType);
	}

	// Check for at least one property in object schema
	if (hasAtLeastOneElement(meta.keys)) {

		/** @type {TypeGuard<keyof R>} */
		const check = isLiteralOf(meta.keys);

		return check;
	}

	return isNever;
};

/**
 * Check for object values
 * @template {Shape} S
 * @template {TypeGuard<Record<keyof any, any>> | undefined} [M = undefined]
 * @param {S} shape
 * @param {M} [mapping]
 * @returns {TypeGuard<InferShape<S, M>>}>}
 */
export const isObjectOf = (shape, mapping) => {

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
 * Check for a subset object value
 * @template {Record<string, any>} R
 * @template {keyof R} K
 * @param {TypeGuard<R>} type
 * @param {K | K[]} names
 * @param {boolean} pick
 * @returns {TypeGuard}
 */
const isPartFrom = (type, names, pick) => {

	const meta = getTypeGuardMeta(type);

	// Check for object type
	if (meta.classification !== 'object') {
		throw TypeError(invalidObjectType);
	}

	// Check for valid names type guard
	if (
		typeof names !== 'string' &&
		!(isArray(names) && names.some((name) => (typeof name === 'string')))
	) {
		throw TypeError(invalidKeysType);
	}

	const shape = fromEntries(
		[...meta.required, ...meta.optional].filter(([ key ]) => {

			// Check for key array
			if (isArray(names)) {

				// Check for pick mode
				if (pick) {
					return names.some((name) => (key === name));
				}

				return !names.some((name) => (key === name));
			}

			// Check for pick mode
			if (pick) {
				return (key === names);
			}

			return (key !== names);
		})
	);

	// Check for strict object type
	if (meta.strict) {

		/** @type {TypeGuard} */
		const check = isStrictObjectOf(shape);

		return check;
	}

	/** @type {TypeGuard} */
	const check = isObjectOf(shape, meta.mapping);

	return check;
};

/**
 * Check for a subset object value by omitting the provided keys
 * @template {Record<string, any>} R
 * @template {keyof R} K
 * @param {TypeGuard<R>} type
 * @param {K | K[]} names
 * @returns {TypeGuard<Omit<R, K>>}
 */
export const isOmitFrom = (type, names) => isPartFrom(type, names, false);

/**
 * Check for a subset object value by picking the provided keys
 * @template {Record<keyof any, any>} R
 * @template {keyof R} K
 * @param {TypeGuard<R>} type
 * @param {K | K[]} names
 * @returns {TypeGuard<Pick<R, K>>}
 */
export const isPickFrom = (type, names) => isPartFrom(type, names, true);

/**
 * Check for strict object values
 * @template {Shape} S
 * @param {S} shape
 * @returns {TypeGuard<InferShape<S>>}
 */
export const isStrictObjectOf = (shape) => {

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

export {
	isKeyOf as keyof,
	isObjectOf as object,
	isOmitFrom as omit,
	isPickFrom as pick,
	isStrictObjectOf as strictObject
};