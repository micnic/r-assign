import type { TransformFunction } from 'r-assign';
import type {
	BaseTypeGuard,
	InferTypeGuard,
	RefineFunction,
	TypeGuard
} from 'r-assign';

/**
 * Extract values based on provided type guard and default value
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
export declare function getType<T extends TypeGuard>(
	type: BaseTypeGuard<T>,
	def: InferTypeGuard<T> | (() => InferTypeGuard<T>),
	refine?: RefineFunction<InferTypeGuard<T>>
): TransformFunction<InferTypeGuard<T>>;