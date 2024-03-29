'use strict';

const {
	hasAtLeastTwoElements,
	hasOneElement
} = require('r-assign/lib/internal/array-checks');
const { invalidTemplateLiteral } = require('r-assign/lib/internal/errors');
const { getTemplateLiteralREX } = require('r-assign/lib/internal/get-type-rex');
const { invalidOptionalType } = require('r-assign/lib/internal/invalid-type');
const {
	getTypeGuardMeta,
	isStringTypeGuard,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');
const { isLiteral, isLiteralOf } = require('r-assign/lib/literal');
const { isString } = require('r-assign/lib/string');

/**
 * @template {string} S
 * @typedef {import('r-assign/lib/internal').RTL<S>} ReducibleTemplateLiteral
 */

/**
 * @template {Literal} L
 * @typedef {import('r-assign/lib/internal').STL<L>} StringifiedTemplateLiteral
 */

/**
 * @typedef {import('r-assign/lib').Literal} Literal
 */

/**
 * @template {Literal} [T = any]
 * @typedef {import('r-assign/lib').TemplateLiteral<T>} TemplateLiteral
 */

/**
 * @template {TemplateLiteral} T
 * @typedef {import('r-assign/lib').InferTL<T>} InferTemplateLiteral
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

const { isArray } = Array;
const { values } = Object;

/**
 * Check if template literal part can be reduced to string literals
 * @template {Literal} L
 * @template {string} S
 * @param {TypeGuard<L> | S} part
 * @returns {type is TypeGuard<S>}
 */
const canReducePart = (part) => {

	// Check for string parts
	if (typeof part === 'string') {
		return true;
	}

	const meta = getTypeGuardMeta(part);

	// Switch on type classification
	switch (meta.classification) {

		case 'literal':
		case 'literals': {
			return true;
		}

		case 'primitive': {
			return (meta.primitive === 'boolean');
		}

		case 'union': {
			return meta.union.every(canReducePart);
		}

		default: {
			return false;
		}
	}
};

/**
 * Check if template literal can be reduced to string literals
 * @template {Literal} L
 * @template {StringifiedTemplateLiteral<L>} T
 * @template {string} S
 * @param {T} template
 * @returns {template is ReducibleTemplateLiteral<S>}
 */
const canReduceTemplate = (template) =>
	(hasOneElement(template) &&
		typeof template[0] === 'function' &&
		isStringTypeGuard(template[0])) ||
	template.every(canReducePart);

/**
 * Reduce template literal parts to string literals
 * @template {string} S
 * @param {string[]} result
 * @param {S | TypeGuard<S>} part
 * @returns {string[]}
 */
const reducePart = (result, part) => {

	// Check for string parts
	if (typeof part === 'string') {
		return result.map((literal) => `${literal}${part}`);
	}

	const meta = getTypeGuardMeta(part);

	// Switch on type classification
	switch (meta.classification) {

		case 'literal': {
			return result.map((literal) => `${literal}${meta.literal}`);
		}

		case 'literals': {
			return result.flatMap((string) => {
				return meta.literals.map((literal) => `${string}${literal}`);
			});
		}

		case 'primitive': {

			// Check for boolean type guard
			/* istanbul ignore else */
			if (meta.primitive === 'boolean') {
				return result.flatMap((string) => {
					return [`${string}false`, `${string}true`];
				});
			}

			/* istanbul ignore next */
			throw TypeError(invalidTemplateLiteral);
		}

		case 'union': {
			return result.flatMap((string) => {
				return meta.union.flatMap((type) => {
					return reducePart([string], type);
				});
			});
		}

		/* istanbul ignore next */
		default: {
			throw TypeError(invalidTemplateLiteral);
		}
	}
};

/**
 * Reduce template literal to string literals
 * @template {string} S
 * @template {ReducibleTemplateLiteral<S>} T
 * @param {T} template
 * @returns {TypeGuard}
 */
const reduceTemplate = (template) => {

	// Check for empty template literal
	if (template.length === 0) {
		return isLiteral('');
	}

	// Check for only one string type guard
	if (
		hasOneElement(template) &&
		typeof template[0] === 'function' &&
		isStringTypeGuard(template[0])
	) {
		return template[0];
	}

	const literals = template.reduce(reducePart, ['']);

	// Check for multiple literals
	if (hasAtLeastTwoElements(literals)) {
		return isLiteralOf(literals);
	}

	// Check for one literal
	/* istanbul ignore else */
	if (hasOneElement(literals)) {
		return isLiteral(literals[0]);
	}

	/* istanbul ignore next */
	throw TypeError(invalidTemplateLiteral);
};

/**
 * Get template literal annotation
 * @template {Literal} L
 * @param {StringifiedTemplateLiteral<L>} template
 * @returns {string}
 */
const getTemplateLiteralAnnotation = (template) => {

	return `\`${template.map((type) => {

		// Check for type guard
		if (typeof type === 'function') {

			const { annotation, classification } = getTypeGuardMeta(type);

			// Check for optional type
			if (classification === 'optional') {
				throw TypeError(invalidOptionalType('template literal'));
			}

			return `\${${annotation}}`;
		}

		return type;
	}).join('')}\``;
};

/**
 * Stringify literals and omit empty strings
 * @param {Literal} literal
 * @returns {string | []}
 */
const stringifyLiteral = (literal) => {

	// Check for string literal
	if (typeof literal === 'string') {

		// Check for empty string
		if (literal === '') {
			return [];
		}

		return literal;
	}

	return String(literal);
};

/**
 * Stringify template literal parts
 * @template {Literal} L
 * @param {L | TypeGuard<L>} part
 * @returns {string | TypeGuard | StringifiedTemplateLiteral<any>}
 */
const stringifyParts = (part) => {

	// Check for type guard parts
	if (typeof part === 'function') {

		const meta = getTypeGuardMeta(part);

		// Switch on type classification
		switch (meta.classification) {

			case 'any': {
				return isString;
			}

			case 'literal': {
				return stringifyLiteral(meta.literal);
			}

			case 'template-literal': {
				return meta.template;
			}

			default: {
				return part;
			}
		}
	}

	return stringifyLiteral(part);
};

/**
 * Reduce strings and string type guards
 * @param {StringifiedTemplateLiteral<any>} parts
 * @param {string | TypeGuard} part
 * @returns {StringifiedTemplateLiteral<any>}
 */
const reduceParts = (parts, part) => {

	// Check for first or next parts
	if (parts.length > 0) {

		const index = parts.length - 1;
		const prev = parts[index];

		// Check for previous parts
		/* istanbul ignore else */
		if (prev) {
			if (typeof part === 'string') {
				if (typeof prev === 'string') {
					parts[index] = `${prev}${part}`;
				} else {
					parts.push(part);
				}
			} else if (isStringTypeGuard(part)) {
				if (typeof prev === 'string' || !isStringTypeGuard(prev)) {
					parts.push(part);
				}
			} else {
				parts.push(part);
			}
		}
	} else {
		parts.push(part);
	}

	return parts;
};

/**
 * Create a compact template
 * @template {Literal} L
 * @template {TemplateLiteral<L>} T
 * @param {T} parts
 * @returns {StringifiedTemplateLiteral<L>}
 */
const createTemplate = (parts) => {

	/** @type {StringifiedTemplateLiteral<L>} */
	const template = [];

	return values(parts).flatMap(stringifyParts).reduce(reduceParts, template);
};

/**
 * Check for template literal values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @note Does not accept types that cannot be represented as strings
 * @template {Literal} L
 * @template {TemplateLiteral<L>} T
 * @param {T} parts
 * @returns {TypeGuard<InferTemplateLiteral<T>>}
 */
const isTemplateLiteralOf = (parts) => {

	// Check for valid template literal provided
	if (!isArray(parts)) {
		throw TypeError(invalidTemplateLiteral);
	}

	/** @type {StringifiedTemplateLiteral<L>} */
	const template = createTemplate(parts);

	// Check if template can be reduced to literal check
	if (canReduceTemplate(template)) {
		return reduceTemplate(template);
	}

	const annotation = getTemplateLiteralAnnotation(template);
	const regexp = getTemplateLiteralREX(template);

	/** @type {TypeGuard<InferTemplateLiteral<T>>} */
	const check = (value) => (isString(value) && regexp.test(value));

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'template-literal',
		description: `a template literal of ${annotation}`,
		regexp,
		template
	});

	return check;
};

module.exports = {
	isTemplateLiteralOf,
	templateLiteral: isTemplateLiteralOf
};