import type { TransformFunction } from 'r-assign';

/**
 * Check for non-undefined values
 */
declare const isAny: (value: any) => value is Exclude<any, undefined>;

/**
 * Transform function to validate non-undefined values
 */
declare const parseAny: TransformFunction;

/**
 * Creator of transform functions for non-undefined values
 */
declare const useAny: (initial?: any) => TransformFunction;

export { isAny, parseAny, useAny };