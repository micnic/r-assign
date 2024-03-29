import type { TypeGuard } from 'r-assign/lib';

/**
 * Set same flag for the provided type guard
 */
declare function setSame<T extends TypeGuard<Record<keyof any, any> | any[]>>(
	type: T,
	value?: boolean
): T;

export {
	setSame,
	setSame as same
};