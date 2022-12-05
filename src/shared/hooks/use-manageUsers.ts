// import React from 'react';
import httpFetch from '../../shared/http/http-fetch';
import { actionIf } from '../../shared/hooks/form-hook';
import configData from '../../config.json';
import { AuthContextIf } from '../../shared/context/auth-context';

export const useManageUsers = () => {
	const getHeaders = (auth: AuthContextIf) => {
		return {
			'Content-Type': 'application/json',
			withCredentials: true,
			Authorization: `Bearer ${auth.token}`,
		};
	};

	const userHandler = async (formState: actionIf, apiPath: string) => {
		console.log(formState.inputs);

		const newUserInfo = {} as {
			[key: string | number]: string | number | Date;
		};
		for (const key in formState.inputs) {
			if (!formState.inputs[key]) {
				continue;
			}
			newUserInfo[key] = formState.inputs[key].value;
			// type check before trimming
			if (typeof newUserInfo[key] === 'string') {
				const inputValue: string = newUserInfo[key] as string;
				newUserInfo[key] = inputValue.trim();
			}
		}

		if (apiPath === '/auth/signup') {
			newUserInfo.type = '1';
			newUserInfo.customer_type = '1';
		}

		if (apiPath === '/auth/guestUser/createGuestUser') {
			newUserInfo.type = '2';
			newUserInfo.customer_type = '2';
		}

		const headers = {
			'Content-Type': 'application/json',
			withCredentials: true,
			credentials: 'include',
		};

		try {
			const responseData: any = await httpFetch(
				`${configData.BACKEND_URL}${apiPath}`,
				'POST',
				JSON.stringify(newUserInfo),
				headers
			);
			console.log(responseData);
			return responseData;
		} catch (err) {
			console.error(`error occurred with ${apiPath} - ${err}`);
		}
	};

	const refreshHandler = async (auth: AuthContextIf) => {
		const headers = getHeaders(auth);

		try {
			const responseData: any = await httpFetch(
				`${configData.BACKEND_URL}/auth/refresh`,
				'POST',
				null,
				headers,
				'include'
			);
			console.log(responseData);
			return responseData;
		} catch (err) {
			console.error(`error occurred with refreshUser - ${err}`);
		}
	};

	const logoutHandler = async (auth: AuthContextIf) => {
		const headers = getHeaders(auth); //{ 'Content-Type': 'application/json' };

		try {
			const responseData: any = await httpFetch(
				`${configData.BACKEND_URL}/auth/logout`,
				'POST',
				null,
				headers,
				'include'
			);
			console.log(responseData);
			return responseData;
		} catch (err) {
			console.error(`error occurred with logout - ${err}`);
		}
	};

	return { userHandler, refreshHandler, logoutHandler };
};

export default useManageUsers;
