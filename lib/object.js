import { hasAtLeastOneElement } from './internal/array-checks.js';
import {
	getTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isLiteralOf } from 'r-assign/literal';
import { isNever } from 'r-assign/never';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').OTG<T>} OptionalTypeGuard
 */

/**
 * @typedef {import('r-assign').Shape} Shape
 */

/**
 * @typedef {import('./internal/index.js').TGM} TypeGuardMeta
 */

/**
 * @typedef {import('./internal/index.js').OTTGM} ObjectTypeGuardMeta
 */

/**
 * @typedef {import('./internal/index.js').OLTGM} OptionalTypeGuardMeta
 */

/**
 * @template {Shape} S
 * @typedef {import('r-assign').InferS<S>} InferShape
 */

const { isArray } = Array;
const { entries, fromEntries, keys } = Object;
const { hasOwnProperty } = Object.prototype;

const expectedKeys = 'expected strings or array of strings';
const invalidKeysType = `Invalid keys provided, ${expectedKeys}`;
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
 * @param {S} shape
 * @returns {TypeGuard<InferShape<S>>}>}
 */
export const isObjectOf = (shape) => {

	// Check for non-object shapes
	if (shape === null || typeof shape !== 'object') {
		throw TypeError(invalidShape);
	}

	let strict = false;

	const shapeKeys = keys(shape);

	/** @type {Map<string, Exclude<TypeGuardMeta, OptionalTypeGuardMeta>>} */
	const requiredMap = new Map();

	/** @type {Map<string, OptionalTypeGuardMeta>} */
	const optionalMap = new Map();

	const all = new Map(
		entries(shape)
			.map(([ key, type ]) => {
				const child = getTypeGuardMeta(type);

				/** @type {[string, TypeGuardMeta]} */
				const entry = [key, child];

				// Check for optional properties
				if (child.classification === 'optional') {
					optionalMap.set(key, child);
				} else {
					requiredMap.set(key, child);
				}

				return entry;
			})
			.sort(([first], [second]) => first.localeCompare(second))
	);

	const required = [...requiredMap].map(([ key, meta ]) => {

		/** @type {[string, TypeGuard]} */
		const entry = [key, meta.check];

		return entry;
	});

	const optional = [...optionalMap].map(([key, meta]) => {

		/** @type {[string, OptionalTypeGuard]} */
		const entry = [key, meta.check];

		return entry;
	});

	/** @type {TypeGuard<InferShape<S>>} */
	const check = (value) => {

		// Check for non-object values
		if (value === null || typeof value !== 'object') {
			return false;
		}

		// Check the required properties
		for (const [ key, type ] of required) {
			if (!hasOwn(value, key) || !type(value[key])) {
				return false;
			}
		}

		// Check the optional properties
		for (const [ key, type ] of optional) {
			if (hasOwn(value, key) && !type(value[key])) {
				return false;
			}
		}

		// Check for strict object validation
		if (strict) {

			// Check for unrecognized keys
			for (const key of keys(value)) {
				if (!shapeKeys.includes(key)) {
					return false;
				}
			}

			return true;
		}

		return true;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		all,
		check,
		classification: 'object',
		keys: shapeKeys,
		optional: optionalMap,
		required: requiredMap,
		same: false,
		get strict() {
			return strict;
		},
		set strict(value) {
			strict = value;
		}
	});

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
		[...meta.all]
			.map(([key, child]) => [key, child.check])
			.filter(([key]) => {

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
					return key === names;
				}

				return key !== names;
			})
	);

	// Check for strict object type
	if (meta.strict) {

		/** @type {TypeGuard} */
		const check = setStrict(isObjectOf(shape));

		return check;
	}

	/** @type {TypeGuard} */
	const check = isObjectOf(shape);

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

	// Set strict flag in type guard meta
	meta.strict = strict;

	return type;
};

export {
	isKeyOf as keyof,
	isObjectOf as object,
	isOmitFrom as omit,
	isPickFrom as pick,
	setStrict as strict
};