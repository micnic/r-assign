import type { TransformFunction } from 'r-assign';

/**
 * Check for symbol values
 */
const isSymbol: (value: any) => value is symbol;

/**
 * Creator of transform functions for symbol values
 */
const useSymbol: (initial?: symbol) => TransformFunction<symbol>;

/**
 * Transform function to validate symbol values
 */
const validateSymbol: TransformFunction<symbol>;

export {
	isSymbol,
	useSymbol,
	validateSymbol
};