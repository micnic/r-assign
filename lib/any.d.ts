import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib';

/**
 * Extract any values
 */
declare const getAny: () => TransformFunction;

/**
 * Check for any values
 */
declare const isAny: TypeGuard;

/**
 * Extract and validate any values
 */
declare const parseAny: TransformFunction;

export { getAny, isAny, parseAny };