import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Extract symbol values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getSymbol(initial?: symbol): TransformFunction<symbol>;

/**
 * Check for symbol values
 */
declare const isSymbol: TypeGuard<symbol>;

/**
 * Extract and validate symbol values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseSymbol(
	value?: unknown,
	key?: string,
	source?: unknown
): symbol;

export {
	getSymbol,
	isSymbol,
	isSymbol as symbol,
	parseSymbol
};