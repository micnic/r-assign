import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Extract string values
 */
declare const getString: (initial?: string) => TransformFunction<string>;

/**
 * Check for string values
 */
declare const isString: TypeGuard<string>;

/**
 * Extract and validate string values
 */
declare const parseString: TransformFunction<string>;

export { getString, isString, parseString };