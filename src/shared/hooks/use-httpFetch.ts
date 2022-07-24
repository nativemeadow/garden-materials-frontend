import { useRef, useEffect } from 'react';
import httpFetch from '../http/http-fetch';
import { useQuery } from 'react-query';

export function useHttpFetch<T>(
	queryId: string[],
	url: string,
	method: string,
	body: BodyInit | null | undefined = null,
	headers: {} = {}
) {
	const activeHttpRequests = useRef<AbortController[]>([]);

	const {
		isLoading,
		isError,
		data: groupData,
		error,
	} = useQuery<T, Error>(queryId, async () => {
		// get windows abort controller to abort fetch if the
		// user moves to another page before the fetch completes.
		const httpAbortCtrl = new AbortController();
		// save reference
		activeHttpRequests.current.push(httpAbortCtrl);

		try {
			const response = await httpFetch<T>(url, method, body, headers);

			// remove current abort controller
			activeHttpRequests.current = activeHttpRequests.current.filter(
				(reqCtrl) => reqCtrl !== httpAbortCtrl
			);

			return response as T;
		} catch (error: any) {
			throw new Error(error);
		}
	});

	useEffect(() => {
		return () => {
			activeHttpRequests.current.forEach((abortCtrl) =>
				abortCtrl.abort()
			);
		};
	}, []);

	return { isLoading, isError, groupData, error };
}
