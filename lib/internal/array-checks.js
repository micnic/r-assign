'use strict';

/**
 * Check if the array has at least one element
 * @template T
 * @param {T[]} array
 * @returns {array is [T, ...T[]]}
 */
const hasAtLeastOneElement = (array) => (array.length > 0);

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

/**
 * Check if the array has two elements
 * @template T
 * @param {T[]} array
 * @returns {array is [T, T]}
 */
const hasTwoElements = (array) => (array.length === 2);

module.exports = {
	hasAtLeastOneElement,
	hasAtLeastTwoElements,
	hasOneElement,
	hasTwoElements
};