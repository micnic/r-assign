import type { TransformFunction } from 'r-assign';

/**
 * Check for symbol values
 */
declare const isSymbol: (value: any) => value is symbol;

/**
 * Transform function to validate symbol values
 */
declare const parseSymbol: TransformFunction<symbol>;

/**
 * Creator of transform functions for symbol values
 */
declare const useSymbol: (initial?: symbol) => TransformFunction<symbol>;

export {
	isSymbol,
	parseSymbol,
	useSymbol
};