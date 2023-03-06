import type { TypeGuard } from 'r-assign';

/**
 * Set same flag for the provided type guard
 */
export declare function setSame<
	T extends TypeGuard<Record<keyof any, any> | any[]>
>(type: T, value?: boolean): T;

export { setSame as same };