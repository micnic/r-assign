import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Extract any values
 * @deprecated will be removed in version 2.0, use getType instead
 */
declare function getAny(): TransformFunction;

/**
 * Check for any values
 */
declare const isAny: TypeGuard;

/**
 * Extract and validate any values
 * @deprecated will be removed in version 2.0, use parseType instead
 */
declare function parseAny(): TransformFunction;

export { getAny, isAny, parseAny };