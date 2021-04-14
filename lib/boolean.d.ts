import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib/union';

/**
 * Extract boolean values
 */
declare const getBoolean: (initial?: boolean) => TransformFunction<boolean>;

/**
 * Check for boolean values
 */
declare const isBoolean: TypeGuard<boolean>;

/**
 * Extract and validate boolean values
 */
declare const parseBoolean: TransformFunction<boolean>;

export { getBoolean, isBoolean, parseBoolean };