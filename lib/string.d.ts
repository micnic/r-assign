import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib/union';

/**
 * Creator of transform functions for string values
 */
declare const getString: (initial?: string) => TransformFunction<string>;

/**
 * Check for string values
 */
declare const isString: TypeGuard<string>;

/**
 * Transform function to validate string values
 */
declare const parseString: TransformFunction<string>;

export { getString, isString, parseString };