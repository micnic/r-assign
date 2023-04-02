import {
	invalidFunctionArguments,
	invalidFunctionReturn,
	invalidFunctionVoidReturn,
	invalidPromiseResolve,
	invalidPromiseVoidResolve,
	invalidRefineValue,
	invalidValue
} from './invalid-type.js';
import {
	getTypeGuardMeta,
	getVoidableTypeGuardMeta
} from './type-guard-meta.js';

/**
 * @typedef {import('r-assign').Tuple} Tuple
 */

/**
 * @template {Tuple} A
 * @template {TypeGuard} R
 * @typedef {import('r-assign').InferF<A, R>} InferFunction
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').InferP<T>} InferPromise
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG} TypeGuard
 */

/**
 * @typedef {import('r-assign').Union} Union
 */

/**
 * @typedef {import('./index.js').TGM} TypeGuardMeta
 */

/**
 * @typedef {import('./index.js').ATGM} ArrayTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').FTGM} FunctionTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').OTTGM} ObjectTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').PVTGM} PrimitiveTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').PSTGM} PromiseTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').RDTGM} RecordTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').TLTGM} TemplateLiteralTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').TTGM} TupleTypeGuardMeta
 */

const { isArray } = Array;
const {
	fromEntries,
	getOwnPropertyNames,
	getOwnPropertySymbols,
	keys
} = Object;
const { hasOwnProperty } = Object.prototype;

const invalidUnionType = 'Invalid union type provided';

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
 * Clone source array
 * @param {any} value
 * @param {ArrayTypeGuardMeta} meta
 * @returns {any[]}
 */
const pickArray = (value, meta) => {

	if (meta.same) {
		if (meta.check(value)) {
			return value;
		}

		throw TypeError(invalidValue(meta.check, value));
	}

	if (!isArray(value)) {
		throw TypeError(invalidValue(meta.check, value));
	}

	let index = 0;

	for (const element of value) {

		const picked = pickValue(element, meta.child);

		if (picked !== element) {
			break;
		}

		index++;
	}

	if (index !== value.length) {
		return [
			...value.slice(0, index),
			...value
				.slice(index)
				.map((element) => pickValue(element, meta.child))
		];
	}

	return value;
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
 *
 * @param {any} value
 * @param {ObjectTypeGuardMeta | RecordTypeGuardMeta} meta
 */
const assertObject = (value, meta) => {

	// Check for non-object values
	if (value === null || typeof value !== 'object') {
		throw TypeError(invalidValue(meta.check, value));
	}
};

/**
 * Clone source object
 * @param {any} value
 * @param {ObjectTypeGuardMeta} meta
 * @returns {Record<string, any>}
 */
// eslint-disable-next-line complexity
const pickObject = (value, meta) => {

	if (meta.same) {
		if (meta.check(value)) {
			return value;
		}

		throw TypeError(invalidValue(meta.check, value));
	}

	// Assert value to be an object
	assertObject(value, meta);

	/** @type {Set<string>} */
	const recognized = new Set();

	/** @type {Map<string, any>} */
	const entries = new Map();

	// Loop through required properties
	for (const [key, child] of meta.required) {

		const prop = value[key];
		const picked = pickValue(prop, child);

		// Check for non-primitive properties
		if (prop === picked) {
			recognized.add(key);
		} else {
			entries.set(key, picked);
			break;
		}
	}

	// Loop through optional properties
	for (const [key, child] of meta.optional) {

		const prop = value[key];

		if (hasOwn(value, key)) {
			if (prop === undefined && !child.undef) {
				throw TypeError(invalidValue(meta.check, value));
			}

			const picked = pickValue(prop, child.child);

			// Check for non-primitive properties
			if (prop === picked) {
				recognized.add(key);
			} else {
				entries.set(key, picked);
				break;
			}
		}
	}

	let unrecognized = false;

	for (const key of keys(value)) {

		const prop = value[key];

		// Check for verified key
		if (recognized.has(key)) {
			if (entries.size > 0) {
				entries.set(key, prop);
			}
		} else {
			const child = meta.all.get(key);

			if (child) {
				const picked = pickValue(prop, child);

				entries.set(key, picked);
			} else {
				unrecognized = true;

				if (entries.size > 0) {
					entries.set(key, prop);
				}
			}
		}
	}

	if (unrecognized) {
		return fromEntries([
			...entries,
			...[...recognized].map((key) => [key, value[key]])
		]);
	}

	if (entries.size === 0) {
		return value;
	}

	return fromEntries(entries);
};

/**
 *
 * @param {any} value
 * @param {RecordTypeGuardMeta} meta
 * @returns {Record<string, any>}
 */
const pickRecord = (value, meta) => {

	if (meta.same) {
		if (meta.check(value)) {
			return value;
		}

		throw TypeError(invalidValue(meta.check, value));
	}

	// Assert value to be an object
	assertObject(value, meta);

	const [ keysMeta, valuesMeta ] = meta.children;

	/** @type {Set<string | symbol>} */
	const checked = new Set();

	/** @type {Map<string | symbol, any>} */
	const entries = new Map();

	const properties = [
		...getOwnPropertyNames(value),
		...getOwnPropertySymbols(value)
	];

	// Check every string and symbol key
	for (const key of properties) {

		// Check key type
		if (typeof key === 'string') {
			if (
				!(
					(meta.numeric && keysMeta.check(Number(key))) ||
					keysMeta.check(key)
				)
			) {
				throw TypeError(invalidValue(meta.check, value));
			}
		} else if (!keysMeta.check(key)) {
			throw TypeError(invalidValue(meta.check, value));
		}

		const prop = value[key];
		const picked = pickValue(prop, valuesMeta);

		// Check for non-primitive properties
		if (prop === picked) {
			checked.add(key);
		} else {
			entries.set(key, picked);
		}
	}

	if (entries.size === 0) {
		return value;
	}

	return fromEntries([
		...entries,
		...[...checked].map((key) => [key, value[key]])
	]);
};

/**
 *
 * @param {any} value
 * @param {TypeGuardMeta} meta
 * @returns {any}
 */
const pickValidValue = (value, meta) => {

	if (meta.check(value)) {
		return value;
	}

	throw TypeError(invalidValue(meta.check, value));
};

/**
 * Clone source tuple
 * @param {any} value
 * @param {TupleTypeGuardMeta} meta
 * @returns {any[]}
 */
// eslint-disable-next-line complexity
const pickTuple = (value, meta) => {

	if (meta.same) {
		if (meta.check(value)) {
			return value;
		}

		throw TypeError(invalidValue(meta.check, value));
	}

	if (!isArray(value)) {
		throw TypeError(invalidValue(meta.check, value));
	}

	const { optional, required, rest } = meta.indexes;

	if (value.length === 0) {

		if (optional !== 0 && meta.tuple.length !== 0) {
			throw TypeError(invalidValue(meta.check, value));
		}

		return value;
	}

	if (meta.tuple.length === 0) {
		throw TypeError(invalidValue(meta.check, value));
	}

	/** @type {any[]} */
	const elements = [];

	let checkIndex = 0;
	let index = 0;

	for (const child of meta.children) {

		// Check for the end of the value validation
		if (checkIndex === value.length) {

			// Check for optional validation
			if (optional >= 0 && index < optional) {
				throw TypeError(invalidValue(meta.check, value));
			}

			// Check for rest validation
			if (rest >= 0 && index < rest) {
				throw TypeError(invalidValue(meta.check, value));
			}

			// Check for required validation
			if (optional < 0 && rest < 0) {
				throw TypeError(invalidValue(meta.check, value));
			}

			break;
		}

		switch (child.classification) {

			case 'optional': {

				const prop = value[checkIndex];

				if (prop === undefined) {
					if (!child.undef) {
						throw TypeError(invalidValue(meta.check, value));
					}

					if (elements.length > 0) {
						elements.push(prop);
					}

					checkIndex++;
					index++;
					break;
				}

				const picked = pickValue(prop, child.child);

				if (prop === picked) {
					if (elements.length > 0) {
						elements.push(prop);
					}
				} else {
					if (elements.length === 0) {
						elements.push(...value.slice(0, checkIndex));
					}

					elements.push(picked);
				}

				checkIndex++;
				index++;
				break;
			}

			case 'rest': {

				let stop = value.length;

				if (required > rest) {
					stop += required - meta.tuple.length;
				}

				// Check till the end of the rest
				while (checkIndex < stop) {
					const prop = value[checkIndex];
					const picked = pickValue(prop, child.child);

					if (prop === picked) {
						if (elements.length > 0) {
							elements.push(prop);
						}
					} else {
						if (elements.length === 0) {
							elements.push(...value.slice(0, checkIndex));
						}

						elements.push(picked);
					}

					checkIndex++;
				}

				index++;
				break;
			}

			default: {
				const prop = value[checkIndex];
				const picked = pickValue(prop, child);

				// Check for non-primitive properties
				if (prop === picked) {
					if (elements.length > 0) {
						elements.push(prop);
					}
				} else {
					if (elements.length === 0) {
						elements.push(...value.slice(0, checkIndex));
					}

					elements.push(picked);
				}

				checkIndex++;
				index++;
			}
		}
	}

	if (index !== meta.tuple.length) {

		if (optional >= 0) {
			if (index < optional) {
				throw TypeError(invalidValue(meta.check, value));
			}
		}

		if (rest >= 0) {
			if (index < rest) {
				throw TypeError(invalidValue(meta.check, value));
			}
		}
	}

	if (checkIndex !== value.length) {
		throw TypeError(invalidValue(meta.check, value));
	}

	if (elements.length === 0) {
		return value;
	}

	return elements;
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
		if (type(value)) {
			return pickValue(value, getTypeGuardMeta(type));
		}
	}
	/* c8 ignore next 2 */

	throw TypeError(invalidUnionType);
};

/**
 * Wrap function
 * @param {any} fn
 * @param {FunctionTypeGuardMeta} meta
 * @returns {(...args: any[]) => any}
 */
const wrapFunction = (fn, meta) => {

	if (typeof fn !== 'function') {
		throw TypeError(invalidValue(meta.check, fn));
	}

	const [args, result] = meta.types;

	return (...input) => {

		// Check for valid function arguments
		if (!args(input)) {
			throw TypeError(invalidFunctionArguments(args, input));
		}

		const output = fn(...input);

		// Check for valid function return in case return type is provided
		if (result && !result(output)) {
			throw TypeError(invalidFunctionReturn(result, output));
		}

		// Check for valid function return in case return type is void
		if (!result && output !== undefined) {
			throw TypeError(invalidFunctionVoidReturn(output));
		}

		return pickValue(output, getVoidableTypeGuardMeta(result));
	};};

/**
 * Wrap promise
 * @param {any} promise
 * @param {PromiseTypeGuardMeta} meta
 * @returns {Promise<any>}
 */
const wrapPromise = async (promise, meta) => {

	if (!(promise instanceof Promise)) {
		throw TypeError(invalidValue(meta.check, promise));
	}

	const output = await promise;

	// Check for valid promise resolve in case resolve type is provided
	if (meta.type && !meta.type(output)) {
		throw TypeError(invalidPromiseResolve(meta.type, output));
	}

	// Check for valid promise resolve in case resolve type is void
	if (!meta.type && output !== undefined) {
		throw TypeError(invalidPromiseVoidResolve(output));
	}

	return pickValue(output, meta.child);
};

/**
 * Clone provided value based on its type
 * @param {any} value
 * @param {TypeGuardMeta} meta
 * @returns {any}
 */
export const pickValue = (value, meta) => {

	// Switch on type classification
	switch (meta.classification) {

		case 'array': {
			return pickArray(value, meta);
		}

		case 'function': {
			return wrapFunction(value, meta);
		}

		case 'instance':
		case 'literal':
		case 'literals':
		case 'primitive':
		case 'template-literal': {
			return pickValidValue(value, meta);
		}

		case 'intersection': {
			return pickIntersection(value, meta.children);
		}

		case 'never': {
			throw TypeError(invalidValue(meta.check, value));
		}

		case 'object': {
			return pickObject(value, meta);
		}

		case 'promise': {
			return wrapPromise(value, meta);
		}

		case 'record': {
			return pickRecord(value, meta);
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
export const refineValue = (value, type, refine) => {

	const result = refine(value);

	// Check the result of the refine function call
	if (type(result)) {
		return result;
	}

	throw invalidRefineValue(type, value);
};