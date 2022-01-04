import type { TransformFunction } from 'r-assign';
import type {
	InferTypeGuard,
	NotOptionalTypeGuard,
	ReplaceFunction,
	TypeGuard
} from 'r-assign/lib';

/**
 * Extract and validate values based on provided type guard
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
declare function parseType<T extends TypeGuard>(
	type: NotOptionalTypeGuard<T>,
	replace?: ReplaceFunction<InferTypeGuard<T>>
): TransformFunction<InferTypeGuard<T>>;

export { parseType };