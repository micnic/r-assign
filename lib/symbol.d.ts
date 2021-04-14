import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib/union';

/**
 * Extract symbol values
 */
declare const getSymbol: (initial?: symbol) => TransformFunction<symbol>;

/**
 * Check for symbol values
 */
declare const isSymbol: TypeGuard<symbol>;

/**
 * Extract and validate symbol values
 */
declare const parseSymbol: TransformFunction<symbol>;

export {
	getSymbol,
	isSymbol,
	parseSymbol
};