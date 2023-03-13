import { getTypeGuardMeta } from './type-guard-meta.js';

/**
 * @typedef {import('r-assign').Literal} Literal
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign').TG<T>} TypeGuard
 */

/**
 * @typedef {import('r-assign').Union} Union
 */

/**
 * @template {Literal} [T = any]
 * @typedef {import('./index.js').STL<T>} StringifiedTemplateLiteral
 */

const invalidTemplateLiteralType = 'Invalid type for template literal type';

const bigintRex = '(?:-?0|[1-9]\\d*)';
const decimalRex = '[+-]?(?:\\d+\\.?\\d*|\\.\\d+)(?:[Ee][+-]?\\d+)?';
const binaryRex = '0b[01]+';
const octalRex = '0o[0-7]+';
const hexRex = '0x[\\dA-Fa-f]+';
const numberRex = `(?:${decimalRex}|${binaryRex}|${octalRex}|${hexRex})`;
const stringRex = '(?:.*)';

const escapeRegExp = /[.*+?^${}()|[\]\\]/g;
const escapeReplace = '\\$&';

/**
 * Get regular expression string for the provided literals
 * @param {Literal[]} literals
 * @returns {string}
 */
const getLiteralsREX = (literals) => `(?:${literals.map(String).join('|')})`;

/**
 * Map union types to regular expression strings
 * @param {Union} union
 * @returns {string[]}
 */
const mapUnionREX = (union) => {

	/** @type {string[]} */
	const result = [];

	return union.reduce((output, type) => {

		const meta = getTypeGuardMeta(type);

		// Switch on type classification
		switch (meta.classification) {

			case 'literal': {
				return [...output, String(meta.literal)];
			}

			case 'literals': {
				return [...output, getLiteralsREX(meta.literals)];
			}

			case 'primitive': {

				// Switch on primitive type
				switch (meta.primitive) {

					case 'bigint': {
						return [...output, bigintRex];
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

			case 'template-literal': {
				return [...output, getTemplateLiteralREXString(meta.template)];
			}

			default: {
				throw TypeError(invalidTemplateLiteralType);
			}
		}
	}, result);
};

/**
 * Get regular expression string for union type
 * @param {Union} union
 * @returns {string}
 */
const getUnionREXString = (union) => `(?:${mapUnionREX(union).join('|')})`;

/**
 * Get regular expression string for the provided type guard
 * @param {TypeGuard} type
 * @returns {string}
 */
const getTypeREXString = (type) => {

	const meta = getTypeGuardMeta(type);

	// Switch on type classification
	switch (meta.classification) {

		case 'literals': {
			return getLiteralsREX(meta.literals);
		}

		case 'primitive': {

			// Switch on primitive type
			switch (meta.primitive) {

				case 'bigint': {
					return bigintRex;
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

		case 'union': {
			return getUnionREXString(meta.union);
		}

		default: {
			throw TypeError(invalidTemplateLiteralType);
		}
	}
};

/**
 * Get regular expression string for template literal type
 * @template {Literal} L
 * @param {StringifiedTemplateLiteral<L>} template
 * @returns {string}
 */
const getTemplateLiteralREXString = (template) => template.map((part) => {

	// Check for type guard
	if (typeof part === 'function') {
		return getTypeREXString(part);
	}

	return part.replace(escapeRegExp, escapeReplace);
}).join('');

/**
 * Wrap regular expression string in a regular expression
 * @param {string} string
 * @returns {RegExp}
 */
const wrapREX = (string) => RegExp(`^${string}$`);

/**
 * Get template literal regular expression
 * @template {Literal} L
 * @param {StringifiedTemplateLiteral<L>} template
 * @returns {RegExp}
 */
export const getTemplateLiteralREX = (template) =>
	wrapREX(getTemplateLiteralREXString(template));

/**
 * Get type regular expression
 * @param {TypeGuard} type
 * @returns {RegExp}
 */
// TODO: Reanimate this function to use for intersection optimizer
// eslint-disable-next-line capitalized-comments
// const getTypeREX = (type) => wrapREX(getTypeREXString(type));