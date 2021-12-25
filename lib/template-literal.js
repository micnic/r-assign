'use strict';

const { invalidOptionalType } = require('r-assign/lib/internal/invalid-type');
const {
	getTypeGuardMeta,
	setTypeGuardMeta
} = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign/lib').Intersection} Intersection
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
 * @typedef {import('r-assign/lib').Union} Union
 */

const invalidTemplateLiteralType = 'Invalid type for template literal type';

const bigintRex = '(?:-?0|[1-9]\\d*)';
const booleanRex = '(?:true|false)';
const decimalRex = '[+-]?(?:\\d+\\.?\\d*|\\.\\d+)(?:[Ee][+-]?\\d+)?';
const binaryRex = '0b[01]+';
const octalRex = '0o[0-7]+';
const hexRex = '0x[\\dA-Fa-f]+';
const numberRex = `(?:${decimalRex}|${binaryRex}|${octalRex}|${hexRex})`;
const stringRex = '(?:.*)';

/**
 *
 * @param {Literal[]} literals
 * @returns {string}
 */
const getLiteralsRegExp = (literals) => {

	return `(?:${literals.map(String).join('|')})`;
};

/**
 * Get template literal annotation
 * @template {Literal} L
 * @param {TemplateLiteral<L>} template
 * @returns {string}
 */
const getTemplateLiteralAnnotation = (template) => {

	return `\`\${${template.map((type) => {

		// Check for type guard
		if (typeof type === 'function') {

			const { annotation, classification } = getTypeGuardMeta(type);

			// Check for optional type
			if (classification === 'optional') {
				throw TypeError(invalidOptionalType('template literal'));
			}

			return annotation;
		}

		return String(type);
	}).join('')}}\``;
};

/**
 * Get regular expression string for the provided type guard
 * @param {TypeGuard} type
 * @returns {string}
 */
const getTypeREString = (type) => {

	const meta = getTypeGuardMeta(type);
	const { classification } = meta;

	// Switch on type classification
	switch (classification) {

		case 'any': {
			return stringRex;
		}

		case 'intersection': {
			return getIntersectionREString(meta.types);
		}

		case 'literal': {
			return String(meta.literal);
		}

		case 'literals': {
			return getLiteralsRegExp(meta.literals);
		}

		case 'nullable': {
			return `(?:${getTypeREString(meta.type)}|null)`;
		}

		case 'primitive': {

			// Switch on primitive type
			switch (meta.type) {

				case 'bigint': {
					return bigintRex;
				}

				case 'boolean': {
					return booleanRex;
				}

				case 'number': {
					return numberRex;
				}

				case 'string': {
					return stringRex;
				}

				default: {
					throw TypeError(invalidTemplateLiteralType);
				}
			}
		}

		case 'template-literal': {
			return getTemplateLiteralREString(meta.template);
		}

		case 'union': {
			return getUnionREString(meta.types);
		}

		default: {
			throw TypeError(invalidTemplateLiteralType);
		}
	}
};

/**
 * Get regular expression string for union type
 * @param {Union} union
 * @returns {string}
 */
const getUnionREString = (union) => {

	return `(?:${mapUnionRegExp(union).join('|')})`;
};

/**
 * Map intersection types to regular expression strings
 * @param {Intersection} intersection
 * @returns {string[]}
 */
const mapIntersectionRegExp = (intersection) => {

	return intersection.map((type) => {

		const meta = getTypeGuardMeta(type);
		const { classification } = meta;

		// Switch on type classification
		switch (classification) {

			case 'intersection': {
				return mapIntersectionRegExp(meta.types);
			}

			case 'union': {
				return mapUnionRegExp(meta.types);
			}

			default: {
				throw TypeError(invalidTemplateLiteralType);
			}
		}
	}).reduce((result, group) => result.filter((rex) => group.includes(rex)));
};

/**
 * Map union types to regular expression strings
 * @param {Union} union
 * @returns {string[]}
 */
const mapUnionRegExp = (union) => {

	/** @type {string[]} */
	const result = [];

	return union.reduce((output, type) => {

		const meta = getTypeGuardMeta(type);
		const { classification } = meta;

		// Switch on type classification
		switch (classification) {

			case 'intersection': {
				return [...output, ...mapIntersectionRegExp(meta.types)];
			}

			case 'union': {
				return [...output, ...mapUnionRegExp(meta.types)];
			}

			case 'literal': {
				return [...output, String(meta.literal)];
			}

			case 'literals': {
				return [...output, getLiteralsRegExp(meta.literals)];
			}

			case 'primitive': {

				// Switch on primitive type
				switch (meta.type) {

					case 'bigint': {
						return [...output, bigintRex];
					}

					case 'boolean': {
						return [...output, booleanRex];
					}

					case 'number': {
						return [...output, numberRex];
					}

					case 'string': {
						return [...output, stringRex];
					}

					default: {
						throw TypeError(invalidTemplateLiteralType);
					}
				}
			}

			default: {
				throw TypeError(invalidTemplateLiteralType);
			}
		}
	}, result);
};

/**
 * Get regular expression string for intersection type
 * @param {Intersection} intersection
 * @returns {string}
 */
const getIntersectionREString = (intersection) => {

	return `(?:${mapIntersectionRegExp(intersection).join('|')})`;
};

/**
 * Get regular expression string for template literal type
 * @template {Literal} L
 * @param {TemplateLiteral<L>} template
 * @returns {string}
 */
const getTemplateLiteralREString = (template) => {

	return template.map((type) => {

		// Check for type guard
		if (typeof type === 'function') {
			return getTypeREString(type);
		}

		return String(type);
	}).join('');
};

/**
 * Get template literal regular expression
 * @template {Literal} L
 * @param {TemplateLiteral<L>} template
 * @returns {RegExp}
 */
const getTemplateLiteralRegExp = (template) => {

	return RegExp(`^${getTemplateLiteralREString(template)}$`);
};

/**
 * Check for template literal values
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 * @note Does not accept types that cannot be represented as strings
 * @template {Literal} L
 * @template {TemplateLiteral<L>} T
 * @param {T} template
 * @returns {TypeGuard<InferTemplateLiteral<T>>}
 */
const isTemplateLiteralOf = (template) => {

	const annotation = getTemplateLiteralAnnotation(template);
	const regexp = getTemplateLiteralRegExp(template);

	/** @type {TypeGuard<InferTemplateLiteral<T>>} */
	const check = (value) => {

		// Check for string values
		if (typeof value === 'string') {
			return regexp.test(value);
		}

		return false;
	};

	// Save type guard meta
	setTypeGuardMeta(check, {
		annotation,
		classification: 'template-literal',
		description: `a template literal of ${annotation}`,
		template
	});

	return check;
};

module.exports = {
	isTemplateLiteralOf
};