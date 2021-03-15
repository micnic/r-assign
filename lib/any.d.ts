import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib/union';

/**
 * Creator of transform functions for non-undefined values
 */
declare const getAny: (initial?: any) => TransformFunction;

/**
 * Check for non-undefined values
 */
declare const isAny: TypeGuard;

/**
 * Transform function to validate non-undefined values
 */
declare const parseAny: TransformFunction;

export { getAny, isAny, parseAny };