import type { TransformFunction } from 'r-assign';
import type {
	BaseTypeGuard,
	InferTypeGuard,
	RefineFunction,
	TypeGuard
} from 'r-assign/lib';

/**
 * Extract and validate values based on provided type guard
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
declare function parseType<T extends TypeGuard>(
	type: BaseTypeGuard<T>,
	refine?: RefineFunction<InferTypeGuard<T>>
): TransformFunction<InferTypeGuard<T>>;

export { parseType };