'use strict';

const { hasOwnProperty } = Object.prototype;
const { entries, keys } = Object;

/**
 * Determines whether all the entries of an object satisfy the specified test
 * @template {Record<string, any>} O
 * @template {O[Extract<keyof O, string>]} V
 * @param {O} object
 * @param {(value: V, key: string) => boolean} callback
 * @returns {boolean}
 */
const forEvery = (object, callback) => {
	return entries(object).every(([key, value]) => callback(value, key));
};

/**
 * Determines whether all the keys of an object satisfy the specified test
 * @param {Record<string, any>} object
 * @param {(key: string) => boolean} callback
 * @returns {boolean}
 */
const forEveryKey = (object, callback) => {
	return keys(object).every((key) => callback(key));
};

/**
 * Performs the specified action for each entry in an object
 * @template {Record<string, any>} O
 * @template {O[Extract<keyof O, string>]} V
 * @param {O} object
 * @param {(value: V, key: string) => void} callback
 */
const forIn = (object, callback) => {
	entries(object).forEach(([key, value]) => {
		callback(value, key);
	});
};

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
	forIn,
	hasOwn
};