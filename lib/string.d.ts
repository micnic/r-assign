import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Extract string values
 * @deprecated will be removed in version 2.0, use getType instead
 */
declare function getString(initial?: string): TransformFunction<string>;

/**
 * Check for string values
 */
declare const isString: TypeGuard<string>;

/**
 * Extract and validate string values
 * @deprecated will be removed in version 2.0, use parseType instead
 */
declare function parseString(): TransformFunction<string>;

export { getString, isString, parseString };