import { useContext, useCallback } from 'react';
import httpFetch from '../http/http-fetch';
import { Items } from '../../shared/interfaces/items';
import configData from '../../config.json';
import { AuthContext } from '../../shared/context/auth-context';
import useShoppingCart from '../../zustand/shoppingCart';

const getChartUrl = (action: string): string => {
	const url = `${configData.BACKEND_URL}/shopping`;
	switch (action) {
		case 'add':
			return `${url}/addItem`;
		case 'remove':
			return `${url}/deleteItem`;
		case 'update':
			return `${url}/updateItem`;
		case 'clear':
			return `${url}/clearCart`;
		default:
			return url;
	}
};

type ServerResponse = { message: string; action: string; items?: [] };
/**
 * description: useManageCart is a hook that manages the cart items. It adds, removes, and updates cart items.
 * 			Manages the cart items in local storage.
 * @returns object with the following functions: add, remove, update, get.
 */
const useManageCart = () => {
	const auth = useContext(AuthContext);
	const shoppingCart = useShoppingCart((state) => state);

	const getHeaders = (token?: boolean | null) => {
		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${
				token ? token : auth.token ? auth.token : false
			}`,
		};
		return header;
	};

	const get = async (token: boolean | null) => {
		return await httpFetch(
			getChartUrl('get'),
			'GET',
			null,
			getHeaders(token)
		);
	};

	const httpRequest = async (
		action: string,
		method: string,
		body: string,
		token: boolean | null
	) => {
		try {
			const data: ServerResponse = await httpFetch(
				getChartUrl(action),
				method,
				body,
				getHeaders(token)
			);
			if (data.message === 'success') {
				return data;
			}
			throw new Error(data.message);
		} catch (error: any) {
			console.log(error);
			throw new Error(error);
		}
	};

	const loadUnknownUserCart = async () => {
		const items = localStorage.getItem('order')
			? (JSON.parse(localStorage.getItem('order')!) as Items[])
			: [];
		shoppingCart.loadCart(items);
	};

	/**
	 * Function called when the user first login in the app. Given the user's token it will fetch the cart items from the server.
	 * 	 If the is a current cart in local storage it will merge the cart items with the cart items from the server.
	 * @param token - user's token
	 * @returns - updated cart items in local storage
	 * */
	const loadCart = useCallback(
		async (token?: boolean | null, itemsList?: Items[]) => {
			const data = itemsList
				? itemsList
				: ((await get(token ? token : auth.token)) as Items[]);
			const items = localStorage.getItem('order')
				? (JSON.parse(localStorage.getItem('order')!) as Items[])
				: [];

			if (data.length === 0 && items.length === 0) {
				return items;
			}

			/*
			 * if the cart item is found in the local storage, then update cart item quantity
			 *   		  with the value from local storage.
			 */
			for (const item of data as Items[]) {
				const found = items.find((i) => i.sku === item.sku);
				if (found) {
					found.item_id = item.item_id;
					found.cart_id = item.cart_id;
					const updateItem = {
						itemId: item.item_id,
						quantity: found.quantity,
					};
					await httpRequest(
						'update',
						'PUT',
						JSON.stringify(updateItem),
						token ? token : auth.token
					);
				} else {
					items.push(item as Items);
				}
			}

			/*
			 * if the cart item is not found in the database, then add cart item to the database.
			 */
			for (const item of items) {
				if (data) {
					const found = data.find((i) => i.sku === item.sku);
					if (!found) {
						await httpRequest(
							'add',
							'POST',
							JSON.stringify(item),
							token ? token : auth.token
						);
					}
				}
			}

			localStorage.setItem('order', JSON.stringify(items));
			shoppingCart.loadCart(items as Items[]);
			return items;
		},
		[]
	);

	/**
	 * description - Function called when the user adds an item to the cart.
	 * @param newItem - new item to be added to the cart
	 * @returns void
	 */
	const add = async (newItem: Items) => {
		if (!auth.token) {
			// create pseudo cart id
			newItem.cart_id = Math.trunc(Math.random() * 300);
			// create pseudo item id that can be used to update the item or delete it.
			newItem.item_id = Math.trunc(Math.random() * 300);
			addItem(newItem);
			return newItem;
		}
		const body = JSON.stringify(newItem);
		try {
			const data: ServerResponse = await httpFetch(
				getChartUrl('add'),
				'POST',
				body,
				getHeaders()
			);

			if (data.message === 'success') {
				for (const item of data.items as Items[]) {
					newItem.cart_id = item.cart_id;
					newItem.item_id = item.item_id;
				}
				addItem(newItem);
				return newItem;
			} else {
				throw new Error(data.message);
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	};

	/**
	 *
	 * @param itemId - item id to be removed from the cart
	 * @returns updated cart items in local storage
	 */
	const remove = async (itemId: number) => {
		if (!auth.token) {
			return removeItem(itemId);
		}

		const body = JSON.stringify({ itemId });
		try {
			const data: ServerResponse = await httpFetch(
				getChartUrl('remove'),
				'DELETE',
				body,
				getHeaders()
			);
			if (data.message === 'success') {
				return removeItem(itemId);
			}
			throw new Error(data.message);
		} catch (err) {
			console.log(err);
			throw err;
		}
	};

	/**
	 * description - Function called when the user updates the quantity of an item in the cart.
	 * @param itemId - item id to be updated in the cart
	 * @param quantity - new quantity of the item
	 * @returns updated cart items in local storage
	 */
	const update = async (itemId: number, quantity: number) => {
		if (!auth.token) {
			return changeItemQty(itemId, quantity);
		}

		const body = JSON.stringify({
			itemId,
			quantity: quantity,
		});
		try {
			const data: ServerResponse = await httpFetch(
				getChartUrl('update'),
				'PUT',
				body,
				getHeaders()
			);
			if (data.message === 'success') {
				return changeItemQty(itemId, quantity);
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	};

	const addItem = (newItem: Items) => {
		let items: Items[];

		if (localStorage.getItem('order')) {
			items = JSON.parse(localStorage.getItem('order')!) as Items[];

			const existingOrder = items.find(
				(product) =>
					product.sku === newItem.sku && product.unit === newItem.unit
			);

			if (existingOrder) {
				existingOrder.quantity += newItem.quantity;
			} else {
				items = [newItem, ...items];
			}
		} else {
			items = [];
			items.push(newItem);
		}

		localStorage.setItem('order', JSON.stringify(items));
	};

	const removeItem = (itemId: number): Items[] => {
		const cartItems = JSON.parse(localStorage.getItem('order')!) as Items[];
		// clone the array of cart objects less the deleted item
		const newCartItems = cartItems.filter(
			(item) => item.item_id !== itemId,
			10
		);
		// save update to local storage
		localStorage.setItem('order', JSON.stringify(newCartItems));
		// return the cloned and update array to update the cartItems.
		return newCartItems;
	};

	const changeItemQty = (itemId: number, newQty: number) => {
		// get the cart items from local storage
		const cartItems = JSON.parse(localStorage.getItem('order')!) as Items[];
		// clone the item to update the quantity
		const cartItem = cartItems.find((item) => item.item_id === itemId);

		// update the quantity in the clone
		if (cartItem) {
			cartItem.quantity = newQty;
		}
		// clone the array of cart objects adding the updated item
		const newCartItems = [...cartItems];
		// save update to local storage
		localStorage.setItem('order', JSON.stringify(newCartItems));
		// return the cloned and update array to update the cartItems.
		return newCartItems;
	};

	return { loadCart, loadUnknownUserCart, add, remove, update, get };
};

export default useManageCart;
