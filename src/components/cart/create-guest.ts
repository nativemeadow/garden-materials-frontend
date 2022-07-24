import React from 'react';
import httpFetch from '../../shared/http/http-fetch';
import { User } from '../../shared/interfaces/user';

const createGuest = async (guest: any) => {
	const guestUser = {} as { [key: string | number]: string };

	guestUser.username = 'guest';
	guestUser.customer_type = '2';
	try {
		const url = 'http://localhost:5000/api/guests/create';
		const data = await httpFetch(url, 'POST', guest);
		return data;
	} catch (err: any) {
		console.error(err);
	}
};

export default createGuest;
