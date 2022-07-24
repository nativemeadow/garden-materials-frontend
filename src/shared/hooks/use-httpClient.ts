import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const activeHttpRequests = useRef<AbortController[]>([]);

	const sendRequest = useCallback(async function fetcher<T>(
		url: string,
		method: string = 'GET',
		body: BodyInit | null = null,
		headers: {} = {}
	): Promise<T> {
		setIsLoading(true);
		// get windows abort controller to abort fetch if the
		// user moves to another page before the fetch completes.
		const httpAbortCtrl = new AbortController();
		// save reference
		activeHttpRequests.current.push(httpAbortCtrl);
		try {
			const response = await fetch(url, {
				method,
				body,
				headers,
				signal: httpAbortCtrl.signal,
			});

			const data = await response.json();

			// remove current abort controller
			activeHttpRequests.current = activeHttpRequests.current.filter(
				(reqCtrl) => reqCtrl !== httpAbortCtrl
			);
			setIsLoading(false);

			if (response.status > 299) {
				setError(data.message);
			}
			return data as T;
		} catch (err: any) {
			console.error('Error occurred fetching data', err);
			return err;
		}
	},
	[]);

	const clearError = () => {
		setError(null);
	};

	useEffect(() => {
		return () => {
			activeHttpRequests.current.forEach((abortCtrl) =>
				abortCtrl.abort()
			);
		};
	}, []);

	return { isLoading, error, sendRequest, clearError };
};
