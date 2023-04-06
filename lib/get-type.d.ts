import type { TransformFunction } from 'r-assign';
import type {
	BaseTypeGuard,
	InferType,
	RefineFunction,
	TypeGuard
} from 'r-assign';

/**
 * Extract values based on provided type guard and default value
 */
export declare function getType<T extends TypeGuard>(
	type: BaseTypeGuard<T>,
	def: InferType<T> | (() => InferType<T>),
	refine?: RefineFunction<InferType<T>>
): TransformFunction<InferType<T>>;