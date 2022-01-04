'use strict';

const { invalidOptionalType } = require('r-assign/lib/internal/invalid-type');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
const { isObjectOf } = require('r-assign/lib/object');

/**
 * @template {TypeGuard} T
 * @typedef {import('r-assign/lib').InferTG<T>} InferTypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Literal} Literal
 */

/**
 * @typedef {import('r-assign/lib').Shape} Shape
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

const { getOwnPropertyNames, getOwnPropertySymbols } = Object;

/**
 * Validate literal key to be a string or a number
 * @param {Literal} literal
 * @returns {literal is string | number}
 */
const validateLiteralKey = (literal) => (
	typeof literal === 'string' ||
	typeof literal === 'number'
);

/**
 *
 * @template {TypeGuard<keyof any>} K
 * @param {K} keys
 * @returns {keys is TypeGuard<string | number>}
 */
const canReduceKeys = (keys) => {

	const meta = getTypeGuardMeta(keys);

	switch (meta.classification) {

		case 'literal': {
			return validateLiteralKey(meta.literal);
		}

		case 'literals': {
			return meta.literals.every(validateLiteralKey);
		}

		case 'union': {
			return meta.union.every(canReduceKeys);
		}

		default: {
			return false;
		}
	}
};

/**
 *
 * @template {TypeGuard<keyof any>} K
 * @param {K} keys
 * @returns {string[]}
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

		/* istanbul ignore next */
		default: {
			throw TypeError('Invalid type guard for record keys');
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

	/** @type {Shape} */
	const shape = {};

	// Add the reduced keys to the shape
	reduceKeys(keys).forEach((key) => {
		shape[key] = values;
	});

	return isObjectOf(shape);
};

/**
 * Validate record keys type
 * @template {TypeGuard<keyof any>} K
 * @param {K} keys
 * @returns {boolean}
 */
const validateRecordKeysType = (keys) => {

	const meta = getTypeGuardMeta(keys);

	// Switch on type classification
	switch (meta.classification) {

		case 'primitive': {
			return (
				meta.primitive === 'number' ||
				meta.primitive === 'string' ||
				meta.primitive === 'symbol'
			);
		}

		case 'template-literal': {
			return true;
		}

		case 'union': {
			return meta.union.every(validateRecordKeysType);
		}

		default: {
			return false;
		}
	}
};

/**
 * Get record keys annotation
 * @template {TypeGuard<keyof any>} K
 * @param {K} keys
 * @returns {string}
 */
const getKeysAnnotation = (keys) => {

	const { annotation, classification } = getTypeGuardMeta(keys);

	// Check for optional type
	if (classification === 'optional') {
		throw TypeError(invalidOptionalType('record'));
	}

	// Validate keys type
	if (!validateRecordKeysType(keys)) {
		throw TypeError('Invalid type guard for record keys');
	}

	return annotation;
};

/**
 * Get record values annotation
 * @template {TypeGuard} V
 * @param {V} values
 * @returns {string}
 */
const getValuesAnnotation = (values) => {

	const { annotation, classification } = getTypeGuardMeta(values);

	// Check for optional type
	if (classification === 'optional') {
		throw TypeError(invalidOptionalType('record'));
	}

	return annotation;
};

/**
 * Get record annotation based on keys and values type guards
 * @template {TypeGuard<keyof any>} K
 * @template {TypeGuard} V
 * @param {K} keys
 * @param {V} values
 * @returns {string}
 */
const getRecordAnnotation = (keys, values) => {

	return `Record<${getKeysAnnotation(keys)}, ${getValuesAnnotation(values)}>`;
};

/**
 * Check for tuple values
 * @template {TypeGuard<keyof any>} K
 * @template {TypeGuard} V
 * @param {K} keys
 * @param {V} values
 * @returns {TypeGuard<Record<InferTypeGuard<K>, InferTypeGuard<V>>>}
 */
const isRecordOf = (keys, values) => {

	// Check if record can be reduced to an object shape
	if (canReduceKeys(keys)) {
		return reduceRecord(keys, values);
	}

	const annotation = getRecordAnnotation(keys, values);

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

			// Check key and property type
			if (!((keys(key) || keys(Number(key))) && values(value[key]))) {
				return false;
			}
		}

		return true;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'record',
		description: `a record of ${annotation}`,
		keys,
		main: check,
		values
	});

	return check;
};

module.exports = {
	isRecordOf,
	record: isRecordOf
};