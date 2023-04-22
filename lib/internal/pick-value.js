import {
	invalidFunctionArguments,
	invalidFunctionReturn,
	invalidFunctionVoidReturn,
	invalidPromiseResolve,
	invalidPromiseVoidResolve,
	invalidRefineValue,
	invalidValue
} from './invalid-type.js';

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
 * @typedef {import('./index.js').ARTGM} ArrayTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').FTGM} FunctionTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').ITGM} IntersectionTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').OTGM} ObjectTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').PTGM} PrimitiveTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').PRTGM} PromiseTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').RTGM} RecordTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').TLTGM} TemplateLiteralTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').TTGM} TupleTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').UTGM} UnionTypeGuardMeta
 */

const { isArray } = Array;
const {
	fromEntries,
	getOwnPropertyNames,
	getOwnPropertySymbols
} = Object;

/**
 * Clone source array
 * @param {any} value
 * @param {ArrayTypeGuardMeta} meta
 * @returns {any[]}
 */
const pickArray = (value, meta) => {

	if (!isArray(value)) {
		throw TypeError(invalidValue(meta.check, value));
	}

	const { length } = value;

	let index = 0;

	try {
		while (index < length) {

			const element = value[index];


			const picked = pickValue(element, meta.child);

			if (picked !== element) {

				const result = Array(value.length);

				result.splice(0, 0, ...value.slice(0, index), picked);

				index++;

				while (index < length) {
					result[index] = pickValue(value[index], meta.child);
					index++;
				}

				return result;
			}

			index++;
		}
	} catch {
		throw TypeError(invalidValue(meta.check, value));
	}

	return value;
};

/**
 * Clone source value based on the provided intersection type
 * @param {any} value
 * @param {IntersectionTypeGuardMeta} meta
 * @returns {any}
 */
const pickIntersection = (value, meta) => {

	// Check for object value to assign its shape
	if (typeof value === 'object') {

		/** @type {any} */
		const initial = {};

		return meta.children.reduce((result, child) => {
			try {
				return {
					...result,
					...pickValue(value, child)
				};
			} catch {
				throw TypeError(invalidValue(meta.check, value));
			}
		}, initial);
	}

	return pickValidValue(value, meta);
};

/**
 *
 * @param {any} value
 * @param {ObjectTypeGuardMeta | RecordTypeGuardMeta} meta
 * @returns {asserts value is Record<keyof any, any>}
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
const pickObject = (value, meta) => {

	// Assert value to be an object
	assertObject(value, meta);

	/** @type {string[]} */
	const recognized = [];

	/** @type {Record<string, any>} */
	const result = {};

	let modified = false;
	let unrecognized = false;
	let required = meta.required.size;

	for (const key in value) {

		const child = meta.all.get(key);
		const prop = value[key];

		if (child) {

			if (child.classification !== 'optional') {
				required--;
			} else if (prop === undefined && !child.undef) {
				throw TypeError(invalidValue(meta.check, value));
			}

			try {
				const picked = pickValue(prop, child);

				if (prop === picked) {
					recognized.push(key);
				} else {
					result[key] = picked;
					modified = true;
				}
			} catch {
				throw TypeError(invalidValue(meta.check, value));
			}
		} else {
			if (meta.strict) {
				throw TypeError(invalidValue(meta.check, value));
			}

			unrecognized = true;
		}
	}

	// Check for optional type with default value and no property provided
	meta.optional.forEach((child, key) => {
		if (child.def && value[key] === undefined) {

			// Get default value
			result[key] = child.def();

			// Mark as modified
			modified = true;
		}
	});

	if (required > 0) {
		throw TypeError(invalidValue(meta.check, value));
	}

	if (!modified && !unrecognized) {
		return value;
	}

	for (const key of recognized) {
		result[key] = value[key];
	}

	return result;
};

/**
 *
 * @param {any} value
 * @param {RecordTypeGuardMeta} meta
 * @returns {Record<string, any>}
 */
const pickRecord = (value, meta) => {

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
		if (
			!(
				(typeof key === 'string' &&
					meta.numeric &&
					keysMeta.check(Number(key))) ||
				keysMeta.check(key)
			)
		) {
			throw TypeError(invalidValue(meta.check, value));
		}

		try {
			const prop = value[key];
			const picked = pickValue(prop, valuesMeta);

			// Check for non-primitive properties
			if (prop === picked) {
				checked.add(key);
			} else {
				entries.set(key, picked);
			}
		} catch {
			throw TypeError(invalidValue(meta.check, value));
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

	// Check for valid value
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

	try {
		for (const child of meta.children) {

			// Check for the end of the value validation
			if (checkIndex === value.length) {
				// // // Check for optional validation
				// // if (optional >= 0 && index < optional) {
				// // 	throw TypeError(invalidValue(meta.check, value));
				// // }

				// // // Check for rest validation
				// // if (rest >= 0 && index < rest) {
				// // 	throw TypeError(invalidValue(meta.check, value));
				// // }

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
	} catch {
		throw TypeError(invalidValue(meta.check, value));
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
 * @param {UnionTypeGuardMeta} meta
 * @returns {any}
 */
const pickUnion = (value, meta) => {

	// Loop through union types to pick the first one that matches
	for (const child of meta.children) {
		if (child.check(value)) {
			return pickValue(value, child);
		}
	}

	throw TypeError(invalidValue(meta.check, value));
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

		return pickValue(output, meta.children[1]);
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
			return pickIntersection(value, meta);
		}

		case 'never': {
			throw TypeError(invalidValue(meta.check, value));
		}

		case 'object': {
			return pickObject(value, meta);
		}

		case 'optional': {
			return pickValue(value, meta.child);
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
			return pickUnion(value, meta);
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