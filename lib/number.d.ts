/**
 * Check for finite number values
 */
declare function isNumber(value: any): value is number;

/**
 * Creator of transform functions for finite number values
 */
declare function useNumber(initial?: number): (value: any) => number;

export {
	isNumber,
	useNumber
};