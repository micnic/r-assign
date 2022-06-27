'use strict';

/**
 * Check if the array has at least two elements
 * @template T
 * @param {T[]} array
 * @returns {array is [T, T, ...T[]]}
 */
const hasAtLeastTwoElements = (array) => (array.length > 1);

/**
 * Check if the array has one element
 * @template T
 * @param {T[]} array
 * @returns {array is [T]}
 */
const hasOneElement = (array) => (array.length === 1);

module.exports = {
	hasAtLeastTwoElements,
	hasOneElement
};