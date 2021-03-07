import type { TransformFunction } from 'r-assign';

/**
 * Check for symbol values
 */
const isSymbol: (value: any) => value is symbol;

/**
 * Transform function to validate symbol values
 */
const parseSymbol: TransformFunction<symbol>;

/**
 * Creator of transform functions for symbol values
 */
const useSymbol: (initial?: symbol) => TransformFunction<symbol>;

export {
	isSymbol,
	parseSymbol,
	useSymbol
};