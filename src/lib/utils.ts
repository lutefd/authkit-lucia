import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to merge CSS classes using `tw-merge` and `clsx`.
 * @example
 * import { cn } from './utils';
 * const buttonStyles = cn('bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', className);
 *
 * @param {...ClassValue[]} inputs - Variadic argument list containing one or more class values to be merged.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
