import type { AnyTypeGuard } from 'r-assign/lib';

/**
 * Extract any values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 */
declare function getAny(value?: unknown, key?: string, source?: unknown): any;

/**
 * Check for any values
 */
declare const isAny: AnyTypeGuard;

/**
 * Extract and validate any values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 */
declare function parseAny(value?: unknown, key?: string, source?: unknown): any;

export {
	getAny,
	isAny,
	isAny as any,
	parseAny
};