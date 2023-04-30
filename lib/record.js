import {
	hasAtLeastTwoElements,
	hasOneElement,
	hasTwoElements
} from './internal/array-checks.js';
import {
	assertBaseClassification,
	assertClassification,
	assertPrimitive,
	getTypeGuardMeta,
	setTypeGuardMeta
} from './internal/type-guard-meta.js';
import { isObjectOf } from 'r-assign/object';
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
 * @typedef {import('./internal/index.js').LTGM} LTGM
 */

/**
 * @typedef {import('./internal/index.js').LSTGM} LSTGM
 */

/**
 * @typedef {import('./internal/index.js').OTGM} OTGM
 */

/**
 * @typedef {import('./internal/index.js').PT} PT
 */

/**
 * @template {PT} [T = PT]
 * @typedef {import('./internal/index.js').PTGM<T>} PTGM
 */

/**
 * @typedef {import('./internal/index.js').RKC} RKC
 */

const { fromEntries, getOwnPropertyNames, getOwnPropertySymbols } = Object;

const noArgs = 'No arguments provided for record type, at least one expected';

/**
 * Assert for record keys
 * @param {TGM} meta
 * @returns {asserts meta is RKC}
 */
const assertKeysMeta = (meta) => {

	// Assert for keys classification
	assertClassification(meta.classification, [
		'any',
		'literal',
		'literals',
		'primitive',
		'template-literal',
		'union'
	]);

	// Switch on type classification
	switch (meta.classification) {

		case 'primitive': {
			assertPrimitive(
				meta.primitive,
				['number', 'string', 'symbol'],
				'Invalid type for record keys'
			);
			break;
		}

		case 'union': {
			meta.children.forEach(assertKeysMeta);
			break;
		}

		default: {
			break;
		}
	}
};

/**
 * Check for reducible record
 * @param {TGM} meta
 * @returns {meta is LTGM | LSTGM}
 */
const canReduceKeys = (meta) => {

	// Switch on type classification
	switch (meta.classification) {

		case 'literal':
		case 'literals': {
			return true;
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
 * Reduce record keys
 * @param {LTGM | LSTGM} meta
 * @returns {string[]}
 */
const reduceKeys = (meta) => {

	// Check for literal type
	if (meta.classification === 'literal') {
		return [String(meta.literal)];
	}

	return meta.literals.map(String);
};

/**
 * Reduce record to object
 * @template {Shape} S
 * @param {LTGM | LSTGM} meta
 * @param {TG} values
 * @param {S} [shape]
 * @returns {TG<Record<keyof any, any>>}
 */
const reduceRecord = (meta, values, shape) =>
	isObjectOf(
		{
			...fromEntries(reduceKeys(meta).map((key) => [key, values])),
			...shape
		},
		true
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
 *
 * @template {Shape} S
 * @param {TGM} keysMeta
 * @param {TGM} valuesMeta
 * @param {S | undefined} shape
 * @returns {OTGM | undefined}
 */
const getRequiredMeta = (keysMeta, valuesMeta, shape) => {

	const literalKeys = getLiteralKeys(keysMeta);

	if (shape || literalKeys.length > 0) {

		const shapeCheck = isObjectOf({
			...fromEntries(literalKeys.map((key) => [key, valuesMeta.check])),
			...shape
		});

		const schemaMeta = getTypeGuardMeta(shapeCheck);

		assertClassification(schemaMeta.classification, ['object']);

		return schemaMeta;
	}

	return undefined;
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

	const [ keys, values, shape ] = getRecordArgs(args);

	const keysMeta = getTypeGuardMeta(keys);
	const valuesMeta = getTypeGuardMeta(values);

	// Assert keys type
	assertKeysMeta(keysMeta);

	// Assert values type
	assertBaseClassification(valuesMeta.classification);

	// Check if record can be reduced to an object shape
	if (canReduceKeys(keysMeta)) {
		return reduceRecord(keysMeta, values, shape);
	}

	const numeric = hasNumericKeys(keysMeta);
	const requiredMeta = getRequiredMeta(keysMeta, valuesMeta, shape);

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

		// Check for required properties
		if (requiredMeta && !requiredMeta.check(value)) {
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
			requiredMeta
		],
		classification: 'record',
		numeric,
		types: [keys, values, requiredMeta?.check]
	});

	return check;
};

export { isRecordOf as record };