'use strict';

const { hasOwnProperty } = Object.prototype;

/**
 * Check if object has own property with the provided key
 * @template {Record<string, any>} T
 * @param {T} object
 * @param {string} key
 * @returns {key is keyof T}
 */
const hasOwn = (object, key) => hasOwnProperty.call(object, key);

module.exports = { hasOwn };