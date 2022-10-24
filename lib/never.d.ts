import type { TypeGuard } from 'r-assign/lib';

/**
 * Check for never
 */
declare const isNever: TypeGuard<never>;

export {
	isNever,
	isNever as never
};