import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign';

/**
 * Transform any value to string
 */
export declare const asString: TransformFunction<string>;

/**
 * Check for string values
 */
export declare const isString: TypeGuard<string>;

export { isString as string };