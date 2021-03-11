import type { TransformFunction } from 'r-assign';

/**
 * Check for boolean values
 */
declare const isBoolean: (value: any) => value is boolean;

/**
 * Transform function to validate boolean values
 */
declare const parseBoolean: TransformFunction<boolean>;

/**
 * Creator of transform functions for boolean values
 */
declare const useBoolean: (initial?: boolean) => TransformFunction<boolean>;

export { isBoolean, parseBoolean, useBoolean };