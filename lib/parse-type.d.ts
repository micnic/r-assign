import type { TransformFunction } from 'r-assign';
import type {
	BaseTypeGuard,
	InferType,
	RefineFunction,
	TypeGuard
} from 'r-assign';

/**
 * Extract and validate values based on provided type guard
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function parseType<T extends TypeGuard>(
	type: BaseTypeGuard<T>,
	refine?: RefineFunction<InferType<T>>
): TransformFunction<InferType<T>>;