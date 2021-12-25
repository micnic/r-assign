import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Transform any value to string
 */
declare const convertToString: TransformFunction<string>;

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
declare const parseString: TransformFunction<string>;

export { convertToString, getString, isString, parseString };