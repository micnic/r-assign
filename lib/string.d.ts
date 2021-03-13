import type { TransformFunction } from "r-assign";

/**
 * Creator of transform functions for string values
 */
declare const getString: (initial?: string) => TransformFunction<string>;

/**
 * Check for string values
 */
declare const isString: (value: any) => value is string;

/**
 * Transform function to validate string values
 */
declare const parseString: TransformFunction<string>;

export { getString, isString, parseString };