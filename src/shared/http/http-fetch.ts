// get windows abort controller to abort fetch if the
// user moves to another page before the fetch completes.
// const abortController = new AbortController();
// const { signal } = abortController;

async function httpFetch<T>(
	url: string,
	method: string = 'GET',
	body: BodyInit | null | undefined = null,
	headers: {} = {},
	credentials?: 'same-origin' | 'include' | 'omit'
): Promise<T> {
	try {
		const response = await fetch(url, {
			method,
			body,
			headers,
			credentials,
			//signal,
		});
		const data = await response.json();
		return data as T;
	} catch (err: any) {
		console.error('Error occurred fetching data', err);
		//abortController.abort();
		throw new Error(err.message);
	} finally {
		//abortController.abort();
	}
}

export default httpFetch;
