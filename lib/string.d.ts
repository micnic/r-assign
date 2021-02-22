/**
 * Check for string values
 */
declare function isString(value: any): value is string;

/**
 * Creator of transform functions for string values
 */
declare function useString(initial?: string): (value: any) => string;

export {
	isString,
	useString
};