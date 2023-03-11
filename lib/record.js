import {
	hasAtLeastTwoElements,
	hasOneElement
} from './internal/array-checks.js';
import {
	assertBaseTypeGuard,
	getTypeGuardMeta,
	isKeyTypeGuard,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isObjectOf, setStrict } from 'r-assign/object';
import { isString } from 'r-assign/string';
import { isUnionOf } from 'r-assign/union';

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').InferTG<T>} InferTypeGuard
 */

/**
 * @typedef {import('r-assign').Literal} Literal
 */

/**
 * @typedef {import('r-assign').Shape} Shape
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign').BTG<T>} BaseTypeGuard
 */

const { getOwnPropertyNames, getOwnPropertySymbols } = Object;

const noArgs = 'No arguments provided for record type, at least one expected';

/**
 * Check for reducible record
 * @template {TypeGuard<keyof any>} K
 * @param {K} keys
 * @returns {keys is TypeGuard<string | number>}
 */
const canReduceKeys = (keys) => {

	const meta = getTypeGuardMeta(keys);

	// Switch on type classification
	switch (meta.classification) {

		case 'literal':
		case 'literals': {
			return true;
		}

		case 'union': {
			return meta.union.some(canReduceKeys);
		}

		default: {
			return false;
		}
	}
};

/**
 * Reduce record keys
 * @param {TypeGuard<keyof any>} keys
 * @returns {(TypeGuard | string)[]}
 */
const reduceKeys = (keys) => {

	const meta = getTypeGuardMeta(keys);

	switch (meta.classification) {

		case 'literal': {
			return [String(meta.literal)];
		}

		case 'literals': {
			return meta.literals.map(String);
		}

		case 'union': {
			return meta.union.flatMap(reduceKeys);
		}

		default: {
			return [keys];
		}
	}
};

/**
 * Reduce record to object
 * @template {TypeGuard<string | number>} K
 * @template {TypeGuard} V
 * @param {K} keys
 * @param {V} values
 * @returns {TypeGuard}
 */
const reduceRecord = (keys, values) => {

	/** @type {TypeGuard[]} */
	const mapping = [];
	/** @type {Shape} */
	const shape = {};

	// Add the reduced keys to the shape
	reduceKeys(keys).forEach((key) => {
		if (typeof key === 'string') {
			shape[key] = values;
		} else {
			mapping.push(key);
		}
	});

	// Reduce to object with mapping
	if (hasOneElement(mapping)) {
		return isObjectOf(shape, isRecordOf(mapping[0], values));
	}

	// Reduce to object with union mapping
	if (hasAtLeastTwoElements(mapping)) {
		return isObjectOf(shape, isRecordOf(isUnionOf(mapping), values));
	}

	return setStrict(isObjectOf(shape));
};

/**
 * Prepare arguments for record creation
 * @template {TypeGuard<keyof any>} K
 * @template {TypeGuard} V
 * @param {[K, V] | [V]} args
 * @returns {[K | TypeGuard<string>, V]}
 */
const getRecordArgs = (args) => {

	// Check for only values type guard provided
	if (hasOneElement(args)) {

		// Assert for base type guard
		assertBaseTypeGuard(getTypeGuardMeta(args[0]).classification);

		return [isString, args[0]];
	}

	// Check for keys and values type guards provided
	if (hasAtLeastTwoElements(args)) {

		// Validate keys type
		if (!isKeyTypeGuard(args[0])) {
			throw TypeError('Invalid type guard for record keys');
		}

		// Assert for base type guard
		assertBaseTypeGuard(getTypeGuardMeta(args[1]).classification);

		return [args[0], args[1]];
	}

	throw TypeError(noArgs);
};

/**
 * Check for number keys in record
 * @template {number} N
 * @param {TypeGuard<keyof any>} keys
 * @returns {keys is TypeGuard<N>}
 */
const hasNumberKeys = (keys) => {

	const meta = getTypeGuardMeta(keys);

	// Switch on type classification
	switch (meta.classification) {
		case 'primitive': {
			return (meta.primitive === 'number');
		}

		case 'union': {
			return meta.union.some(hasNumberKeys);
		}

		default: {
			return false;
		}
	}
};

/**
 * Check for tuple values
 * @template {TypeGuard<keyof any>} K
 * @template {TypeGuard} V
 * @param {[K, V] | [V]} args
 * @returns {TypeGuard<Record<InferTypeGuard<K>, InferTypeGuard<V>>>}
 */
export const isRecordOf = (...args) => {

	const [ keys, values ] = getRecordArgs(args);

	// Check if record can be reduced to an object shape
	if (canReduceKeys(keys)) {
		return reduceRecord(keys, values);
	}

	const tryNumber = hasNumberKeys(keys);

	/** @type {TypeGuard<Record<InferTypeGuard<K>, InferTypeGuard<V>>>} */
	const check = (value) => {

		// Check for non-object values
		if (value === null || typeof value !== 'object') {
			return false;
		}

		const properties = [
			...getOwnPropertyNames(value),
			...getOwnPropertySymbols(value)
		];

		// Check every string and symbol key
		for (const key of properties) {

			// Check key type
			if (typeof key === 'string') {
				if (!((tryNumber && keys(Number(key))) || keys(key))) {
					return false;
				}
			} else if (!keys(key)) {
				return false;
			}

			// Check property type
			if (!values(value[key])) {
				return false;
			}
		}

		return true;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		classification: 'record',
		keys,
		same: false,
		values
	});

	return check;
};

export { isRecordOf as record };