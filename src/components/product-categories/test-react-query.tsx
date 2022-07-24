import React, { useState } from 'react';
import { useQuery } from 'react-query';

//import httpFetch from '../../shared/http/http-fetch';
import { Category } from '../../shared/interfaces/category-list';
import configData from '../../config.json';

async function httpFetch<T>(
	url: string,
	method: string = 'GET',
	body: BodyInit | null | undefined = null,
	headers: {} = {}
): Promise<T> {
	try {
		const response = await fetch(url, {
			method,
			body,
			headers,
		});
		const data = await response.json();

		return data as T;
	} catch (err: any) {
		console.error('Error occurred fetching data', err);
		throw new Error(err.message);
	}
}

const TestReactQuery = () => {
	const {
		isLoading,
		isError,
		data: cats,
		error,
	} = useQuery('categories', async () => {
		try {
			return await httpFetch<{ data: Category[] }>(
				`${configData.BACKEND_URL}/categories`
			);
		} catch (error: any) {
			throw new Error(error);
		}
	});

	if (isError) {
		return <div>Error happened</div>;
	}

	if (isLoading) {
		return <div>Is loading</div>;
	}

	return (
		<div>
			<h1>Test React Query</h1>
			<ul>
				{/* {cats?.data.map((item) => {
					<li>{item.title}</li>;
				})} */}
			</ul>
		</div>
	);
};

export default TestReactQuery;
