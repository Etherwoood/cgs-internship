import { useEffect } from 'react';

export const useDebounceEffect = (
	effect: () => void,
	delay: number,
	deps: unknown[],
) => {
	useEffect(() => {
		const handler = setTimeout(() => effect(), delay);
		return () => clearTimeout(handler);
	}, [...(deps || []), delay]);
};
