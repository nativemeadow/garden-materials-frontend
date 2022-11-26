import { useState, useCallback, useEffect } from 'react';
import useShoppingCart from '../../zustand/shoppingCart';
import useManageOrders from '../../shared/hooks/use-manageOrders';
import userOrders from '../../zustand/userOrders';

let logoutTimer: any;

export const useAuth = () => {
	const [token, setToken] = useState<boolean | null>(false);
	const [tokenExpirationDate, setTokenExpirationDate] =
		useState<Date | null>();
	const [userId, setUserId] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);
	const [firstName, setFirstName] = useState<string | null>(null);
	const [lastName, setLastName] = useState<string | null>(null);
	const [phone, setPhone] = useState<string | null>(null);
	const { clearCart } = useShoppingCart();
	const orders = userOrders((state) => state);
	const { clearOrders } = userOrders();
	const { setOrderDetailsFromLocalStorage } = useManageOrders();

	const login = useCallback(
		(
			uid: string | null,
			username: string | null,
			email: string | null,
			firstName: string | null,
			lastName: string | null,
			phone: string | null,
			token: boolean,
			expirationDate?: Date | null
		) => {
			if (token) {
				console.log('logged in');
				// return;
			}
			setToken(token);
			setFirstName(firstName);
			setLastName(lastName);
			setUsername(username);
			setEmail(email);
			setPhone(phone);
			setUserId(uid);
			const tokenExpirationDate =
				expirationDate ||
				new Date(new Date().getTime() + 1000 * 60 * 60);
			setTokenExpirationDate(tokenExpirationDate);
			try {
				localStorage.setItem(
					'userData',
					JSON.stringify({
						userId: uid,
						username,
						email,
						firstName,
						lastName,
						phone,
						token,
						expiration: tokenExpirationDate.toISOString(),
					})
				);
				setOrderDetailsFromLocalStorage();
			} catch (err) {
				console.log(err);
			}
			console.log(
				'localStorage: userData',
				localStorage.getItem('userData')
			);
		},
		[]
	);

	const updateUserSession = useCallback(
		(
			firstName: string | null,
			lastName: string | null,
			email: string | null,
			phone: string | null
		) => {
			setEmail(email);
			setFirstName(firstName);
			setLastName(lastName);
			setPhone(phone);
			try {
				const currentStorageData = JSON.parse(
					localStorage.getItem('userData') || '{}'
				);
				localStorage.setItem(
					'userData',
					JSON.stringify({
						...currentStorageData,
						email,
						firstName,
						lastName,
						phone,
					})
				);
			} catch (err) {
				console.log(err);
			}

			console.log(
				'localStorage: userData',
				localStorage.getItem('userData')
			);
		},
		[]
	);

	const logout = useCallback(() => {
		console.log('logged out. clearing cart and orders');
		setToken(null);
		setTokenExpirationDate(null);
		setUserId(null);
		localStorage.removeItem('userData');
		localStorage.removeItem('order');
		localStorage.removeItem('usersOrder');
		clearCart();
		clearOrders();
		orders.reset();
	}, []);

	// useEffect to check if token is expired nad logout if it is
	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime =
				tokenExpirationDate.getTime() - new Date().getTime();
			// running the timer on the remaining time
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate]);

	useEffect(() => {
		const storedData = localStorage.getItem('userData')
			? JSON.parse(localStorage.getItem('userData')!)
			: null;
		const storedUsersOrder = localStorage.getItem('usersOrder')
			? JSON.parse(localStorage.getItem('usersOrder')!)
			: null;

		if (storedData?.token && new Date(storedData.expiration) > new Date()) {
			login(
				storedData.userId,
				storedData.username,
				storedData.email,
				storedData.firstName,
				storedData.lastName,
				storedData.token,
				storedData.phone,
				new Date(storedData.expiration)
			);
		}

		if (storedUsersOrder?.delivery_instructions) {
			orders.setDeliveryInstructions(
				storedUsersOrder.delivery_instructions
			);
			orders.setRequestedDeliveryDate(
				storedUsersOrder.requested_delivery_date
			);
		}
		storedUsersOrder?.purchase_order &&
			orders.setPurchaseOrder(storedUsersOrder.purchase_order);
	}, [login]);

	return {
		userId,
		username,
		email,
		firstName,
		lastName,
		phone,
		token,
		login,
		logout,
		updateUserSession,
	};
};
