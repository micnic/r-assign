import type { TransformFunction } from 'r-assign';
import type { TypeGuard } from 'r-assign/lib/union';

export type Primitive = bigint | boolean | null | number | symbol | string;

/**
 * Extract literal values
 */
declare const getLiteral: <T extends Primitive>(
	literal: T
) => TransformFunction<T>;

/**
 * Check for literal values
 */
declare const isLiteral: <T extends Primitive>(
	literal: T
) => TypeGuard<T>;

/**
 * Extract and validate literal values
 */
declare const parseLiteral: <T extends Primitive>(
	literal: T
) => TransformFunction<T>;

export { getLiteral, isLiteral, parseLiteral };