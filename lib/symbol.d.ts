import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib/union';

/**
 * Creator of transform functions for symbol values
 */
declare const getSymbol: (initial?: symbol) => TransformFunction<symbol>;

/**
 * Check for symbol values
 */
declare const isSymbol: TypeGuard<symbol>;

/**
 * Transform function to validate symbol values
 */
declare const parseSymbol: TransformFunction<symbol>;

export {
	getSymbol,
	isSymbol,
	parseSymbol
};