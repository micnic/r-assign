import {
	hasAtLeastTwoElements,
	hasOneElement,
	hasTwoElements
} from './internal/array-checks.js';
import {
	assertBaseTypeGuard,
	getTypeGuardMeta,
	isKeyType,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isObjectOf, setStrict } from 'r-assign/object';
import { isString } from 'r-assign/string';

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TG
 */

/**
 * @template {TG} T
 * @typedef {import('r-assign').InferT<T>} InferT
 */

/**
 * @typedef {import('r-assign').Literal} Literal
 */

/**
 * @typedef {import('r-assign').Shape} Shape
 */

/**
 * @template {Shape} S
 * @typedef {import('r-assign').InferS<S>} InferS
 */

/**
 * @template {TG} T
 * @typedef {import('r-assign').BTG<T>} BTG
 */

/**
 * @typedef {import('./internal/index.js').TGM} TGM
 */

/**
 * @typedef {import('./internal/index.js').OTGM} OTGM
 */

const { fromEntries, getOwnPropertyNames, getOwnPropertySymbols } = Object;

const noArgs = 'No arguments provided for record type, at least one expected';

/**
 * Check for reducible record
 * @param {TGM} meta
 * @returns {boolean}
 */
const canReduceKeys = (meta) => {

	// Switch on type classification
	switch (meta.classification) {

		case 'literal':
		case 'literals': {
			return true;
		}

		case 'union': {
			return meta.children.every(canReduceKeys);
		}

		default: {
			return false;
		}
	}
};

/**
 *
 * @param {TGM} meta
 * @returns {string[]}
 */
const getLiteralKeys = (meta) => {

	switch (meta.classification) {

		case 'literal': {
			return [String(meta.literal)];
		}

		case 'literals': {
			return meta.literals.map(String);
		}

		case 'union': {
			return meta.children.flatMap(getLiteralKeys);
		}

		default: {
			return [];
		}
	}
};

/**
 *
 * @param {TG} type
 * @returns {OTGM}
 */
const getObjectTypeGuardMeta = (type) => {

	const meta = getTypeGuardMeta(type);

	if (meta.classification !== 'object') {
		throw TypeError('Invalid object type');
	}

	return meta;
};

/**
 * Reduce record keys
 * @param {TGM} meta
 * @returns {string[]}
 */
const reduceKeys = (meta) => {

	switch (meta.classification) {

		case 'literal': {
			return [String(meta.literal)];
		}

		case 'literals': {
			return meta.literals.map(String);
		}

		case 'union': {
			return meta.children.flatMap(reduceKeys);
		}

		default: {
			throw TypeError('Invalid type guard for record keys');
		}
	}
};

/**
 * Reduce record to object
 * @template {TG} V
 * @template {Shape} S
 * @param {TGM} meta
 * @param {V} values
 * @param {S} [shape]
 * @returns {TG}
 */
const reduceRecord = (meta, values, shape) => setStrict(
	isObjectOf({
		...fromEntries(reduceKeys(meta).map((key) => [key, values])),
		...shape
	})
);

/**
 * Prepare arguments for record creation
 * @template {Shape} S
 * @param {[TG] | [TG, S] | [TG<keyof any>, TG] | [TG<keyof any>, TG, S]} args
 * @returns {[TG<keyof any>, TG, S?]}
 */
const getRecordArgs = (args) => {

	// Check for only values type guard provided
	if (hasOneElement(args)) {

		return [isString, args[0]];
	}

	if (hasTwoElements(args)) {

		if (typeof args[1] === 'object') {

			return [isString, args[0], args[1]];
		}

		return [args[0], args[1]];
	}

	// Check for keys and values type guards provided
	if (hasAtLeastTwoElements(args)) {

		return args;
	}

	throw TypeError(noArgs);
};

/**
 * Check for number keys in record
 * @template {number} N
 * @param {TGM} meta
 * @returns {keys is TG<N>}
 */
const hasNumericKeys = (meta) => {

	// Switch on type classification
	switch (meta.classification) {

		case 'literal': {
			return (typeof meta.literal === 'number');
		}

		case 'primitive': {
			return (meta.primitive === 'number');
		}

		case 'union': {
			return meta.children.some(hasNumericKeys);
		}

		default: {
			return false;
		}
	}
};

/**
 * Check for tuple values
 * @template {TG<keyof any>} K
 * @template {TG} V
 * @template {Shape} S
 * @type {{
 *	(...args: [V]): TG<Record<string, InferT<V>>>;
 *	(...args: [V, S]): TG<Record<string, InferT<V>> & InferS<S>>;
 *	(...args: [K, V]): TG<Record<InferT<K>, InferT<V>>>;
 *	(...args: [K, V, S]): TG<Record<InferT<K>, InferT<V>> & InferS<S>>;
 * }}
 * @param {[V] | [V, S] | [K, V] | [K, V, S]} args
 * @returns {any}
 */
export const isRecordOf = (...args) => {

	const [ keys, values, schema ] = getRecordArgs(args);

	const keysMeta = getTypeGuardMeta(keys);
	const valuesMeta = getTypeGuardMeta(values);

	// Validate keys type
	if (!isKeyType(keysMeta)) {
		throw TypeError('Invalid type for record keys');
	}

	// Assert for base type guard
	assertBaseTypeGuard(valuesMeta.classification);

	// Check if record can be reduced to an object shape
	if (canReduceKeys(keysMeta)) {
		return reduceRecord(keysMeta, values, schema);
	}

	const literalKeys = getLiteralKeys(keysMeta);
	const numeric = hasNumericKeys(keysMeta);

	/** @type {TG<Record<string, any>> | undefined} */
	let schemaCheck;

	/** @type {OTGM | undefined} */
	let schemaMeta;

	if (schema || literalKeys.length > 0) {
		schemaCheck = isObjectOf({
			...fromEntries(literalKeys.map((key) => [key, values])),
			...schema
		});
		schemaMeta = getObjectTypeGuardMeta(schemaCheck);
	}

	/** @type {TG<Record<InferT<K>, InferT<V>>>} */
	const check = (value) => {

		// Check for non-object values
		if (value === null || typeof value !== 'object') {
			return false;
		}

		const properties = [
			...getOwnPropertyNames(value),
			...getOwnPropertySymbols(value)
		];

		if (schemaCheck && !schemaCheck(value)) {
			return false;
		}

		// Check every string and symbol key
		for (const key of properties) {

			// Check key type
			if (typeof key === 'string') {
				if (!((numeric && keys(Number(key))) || keys(key))) {
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
		check,
		children: [
			keysMeta,
			valuesMeta,
			schemaMeta
		],
		classification: 'record',
		numeric,
		types: [keys, values, schemaCheck]
	});

	return check;
};

export { isRecordOf as record };