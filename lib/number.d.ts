import type { TransformFunction } from 'r-assign';

/**
 * Check for finite number values
 */
declare const isNumber: (value: any) => value is number;

/**
 * Transform function to validate number values
 */
declare const parseNumber: TransformFunction<number>;

/**
 * Creator of transform functions for finite number values
 */
declare const useNumber: (initial?: number) => TransformFunction<number>;

export { isNumber, parseNumber, useNumber };