import {
	invalidFunctionArguments,
	invalidFunctionReturn,
	invalidFunctionVoidReturn,
	invalidPromiseResolve,
	invalidPromiseVoidResolve,
	invalidRefineValue
} from './invalid-type.js';
import {
	getTypeGuardMeta,
	getVoidableTypeGuardMeta
} from './type-guard-meta.js';

/**
 * @template A
 * @template R
 * @typedef {import('r-assign').InferF<A, R>} InferFunction
 */

/**
 * @template T
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
 * @typedef {import('./index.js').OTTGM} ObjectTypeGuardMeta
 */

/**
 * @typedef {import('./index.js').TTGM} TupleTypeGuardMeta
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
 * Wrap function
 * @template {TypeGuard} A
 * @template {TypeGuard} R
 * @param {((...args: any[]) => any)} fn
 * @param {A} args
 * @param {R} [result]
 * @returns {InferFunction<A, R>}
 */
const wrapFunction = (fn, args, result) => {

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
	};
};

/**
 * Wrap promise
 * @template {TypeGuard} T
 * @param {Promise<any>} promise
 * @param {T} [type]
 * @returns {InferPromise<T>}
 */
const wrapPromise = async (promise, type) => {

	const output = await promise;

	// Check for valid promise resolve in case resolve type is provided
	if (type && !type(output)) {
		throw TypeError(invalidPromiseResolve(type, output));
	}

	// Check for valid promise resolve in case resolve type is void
	if (!type && output !== undefined) {
		throw TypeError(invalidPromiseVoidResolve(output));
	}

	return pickValue(output, getVoidableTypeGuardMeta(type));
};

/**
 * Clone provided value based on its type
 * @param {any} value
 * @param {TypeGuardMeta} meta
 * @returns {any}
 */
export const pickValue = (value, meta) => {

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
			return wrapFunction(value, ...meta.types);
		}

		case 'intersection': {
			return pickIntersection(value, meta.children);
		}

		case 'object': {
			return pickObject(value, meta);
		}

		case 'promise': {
			return wrapPromise(value, meta.type);
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