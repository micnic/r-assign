/**
 * Check for boolean values
 */
declare function isBoolean(value: any): value is boolean;

/**
 * Creator of transform functions for boolean values
 */
declare function useBoolean(initial?: boolean): (value: any) => boolean;

export {
	isBoolean,
	useBoolean
};