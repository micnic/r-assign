'use strict';

const { hasOwnProperty } = Object.prototype;
const { entries, fromEntries, keys } = Object;

/**
 * Determines whether all the entries of an object satisfy the specified test
 * @template {Record<string, any>} O
 * @template {O[Extract<keyof O, string>]} V
 * @param {O} object
 * @param {(value: V, key: string) => boolean} callback
 * @returns {boolean}
 */
const forEvery = (object, callback) =>
	entries(object).every(([ key, value ]) => callback(value, key));

/**
 * Determines whether all the keys of an object satisfy the specified test
 * @param {Record<string, any>} object
 * @param {(key: string) => boolean} callback
 * @returns {boolean}
 */
const forEveryKey = (object, callback) =>
	keys(object).every((key) => callback(key));

/**
 *
 * @template {Record<string, any>} O
 * @template {keyof O} K
 * @template {O[Extract<K, string>]} V
 * @param {O} object
 * @param {(value: V, key: string) => any} callback
 * @returns {Record<string, any>}
 */
const forMap = (object, callback) =>
	fromEntries(
		entries(object)
			.flatMap(([key, value]) => {

				const result = callback(value, key);

				// Filter out undefined values
				if (result === undefined) {
					return [];
				}

				return [[key, result]];
			})
	);

/**
 * Determines whether an object has a property with the specified name
 * @template {Record<string, any>} T
 * @param {T} object
 * @param {string} key
 * @returns {key is keyof T}
 */
const hasOwn = (object, key) => hasOwnProperty.call(object, key);

module.exports = {
	forEvery,
	forEveryKey,
	forMap,
	hasOwn
};