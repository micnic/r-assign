import type { TransformFunction } from 'r-assign';
import type { AnyTypeGuard } from 'r-assign/lib';

/**
 * Extract any values
 * @deprecated will be removed in version 2.0, use getType instead
 */
declare const getAny: TransformFunction;

/**
 * Check for any values
 */
declare const isAny: AnyTypeGuard;

/**
 * Extract and validate any values
 * @deprecated will be removed in version 2.0, use parseType instead
 */
declare const parseAny: TransformFunction;

export { getAny, isAny, parseAny };