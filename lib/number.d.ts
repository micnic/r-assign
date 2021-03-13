import type { TransformFunction } from 'r-assign';

/**
 * Creator of transform functions for finite number values
 */
declare const getNumber: (initial?: number) => TransformFunction<number>;

/**
 * Check for finite number values
 */
declare const isNumber: (value: any) => value is number;

/**
 * Transform function to validate number values
 */
declare const parseNumber: TransformFunction<number>;

export { getNumber, isNumber, parseNumber };