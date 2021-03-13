import type { TransformFunction } from 'r-assign';

/**
 * Creator of transform functions for non-undefined values
 */
declare const getAny: (initial?: any) => TransformFunction;

/**
 * Check for non-undefined values
 */
declare const isAny: (value: any) => value is Exclude<any, undefined>;

/**
 * Transform function to validate non-undefined values
 */
declare const parseAny: TransformFunction;

export { getAny, isAny, parseAny };