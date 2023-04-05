/**
 * Check if the array has at least one element
 * @template T
 * @param {T[]} array
 * @returns {array is [T, ...T[]]}
 */
export const hasAtLeastOneElement = (array) => (array.length > 0);

/**
 * Check if the array has at least two elements
 * @template T
 * @param {T[]} array
 * @returns {array is [T, T, ...T[]]}
 */
export const hasAtLeastTwoElements = (array) => (array.length > 1);

/**
 * Check if the array has no elements
 * @template T
 * @param {T[]} array
 * @returns {array is []}
 */
export const hasNoElements = (array) => (array.length === 0);

/**
 * Check if the array has one element
 * @template T
 * @param {T[]} array
 * @returns {array is [T]}
 */
export const hasOneElement = (array) => (array.length === 1);

/**
 * Check if the array has two elements
 * @template T
 * @param {T[]} array
 * @returns {array is [T, T]}
 */
export const hasTwoElements = (array) => (array.length === 2);