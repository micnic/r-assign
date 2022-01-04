import type { TypeGuard } from 'r-assign/lib';

/**
 * Check for undefined values
 */
declare const isUndefined: TypeGuard<undefined>;

export {
	isUndefined,
	isUndefined as undef
};