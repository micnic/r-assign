import type { TransformFunction } from 'r-assign';
import type {
	BaseTypeGuard,
	InferTypeGuard,
	RefineFunction,
	TypeGuard
} from 'r-assign/lib';

/**
 * Extract values based on provided type guard and default value
 * @note Does not accept `isOptional*` type guard as it is invalid syntax
 */
declare function getType<T extends TypeGuard>(
	type: BaseTypeGuard<T>,
	initial: InferTypeGuard<T>,
	refine?: RefineFunction<InferTypeGuard<T>>
): TransformFunction<InferTypeGuard<T>>;

export { getType };