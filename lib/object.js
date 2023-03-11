import { hasAtLeastOneElement } from './internal/array-checks.js';
import {
	getTypeGuardMeta,
	getVoidableTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isLiteralOf } from 'r-assign/literal';
import { isNever } from 'r-assign/never';

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
const invalidMapping = 'Invalid object mapping provided';
const invalidObjectType = 'Invalid type provided, expected an object type';
const invalidSetStrict =
	'Invalid type for "setStrict()", only object type is allowed';
const invalidShape = 'Invalid shape provided';

/**
 * Determines whether an object has a property with the specified name
 * @todo: Use Object.hasOwn for Node.js 16+
 * @template {Record<string, any>} R
 * @param {R} object
 * @param {string} key
 * @returns {key is keyof R}
 */
const hasOwn = (object, key) => hasOwnProperty.call(object, key);

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

	const mappingMeta = getVoidableTypeGuardMeta(mapping);

	// Check for invalid mapping
	if (
		(mappingMeta.classification === 'object' && mappingMeta.strict) ||
		(mappingMeta.classification !== 'record' &&
			mappingMeta.classification !== 'void')
	) {
		throw TypeError(invalidMapping);
	}

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

	/** @type {ObjectTypeGuardMeta} */
	const meta = {
		classification: 'object',
		keys: keys(shape),
		mapping,
		optional,
		required,
		same: false,
		strict: false
	};

	/** @type {TypeGuard<InferShape<S, M>>} */
	const check = (value) => {

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
		const check = setStrict(isObjectOf(shape));

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
 * Set strict flag for the provided object type guard
 * @template {TypeGuard<Record<keyof any, any> | any[]>} T
 * @param {T} type
 * @param {boolean} [strict]
 * @returns {T}
 */
export const setStrict = (type, strict = true) => {

	const meta = getTypeGuardMeta(type);

	// Check for object type guard
	if (meta.classification !== 'object') {
		throw TypeError(invalidSetStrict);
	}

	// Set same flag in type guard meta
	setTypeGuardMeta(type, {
		...meta,
		strict
	});

	return type;
};

export {
	isKeyOf as keyof,
	isObjectOf as object,
	isOmitFrom as omit,
	isPickFrom as pick,
	setStrict as strict
};