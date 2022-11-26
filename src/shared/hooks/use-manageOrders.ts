import { useContext, useCallback } from 'react';
import httpFetch from '../http/http-fetch';
import { Items } from '../interfaces/items';
import configData from '../../config.json';
import { AuthContext } from '../context/auth-context';
import useOrders from '../../zustand/userOrders';
import { AuthContextIf } from '../../shared/context/auth-context';
import {
	ServerResponse as customerOrders,
	customerPickupOptions,
	customerCheckoutOptions,
} from '../../shared/interfaces/customer-orders';
import { manualAddress } from '../../shared/interfaces/customerInfo';

const getOrderUrl = (action: string): string => {
	const url = `${configData.BACKEND_URL}/orders`;
	switch (action) {
		case 'get':
			return `${url}/`;
		case 'getOrder':
			return `${url}/getUserOrder`;
		case 'create':
			return `${url}/createOrder`;
		case 'update':
			return `${url}/updateOrder`;
		case 'putCustomerOrder':
			return `${url}/updateCustomerInfo`;
		case 'delete':
			return `${url}/deleteOrder`;
		default:
			return url;
	}
};

type ServerResponse = { message: string; action: string; items?: Array<Items> };

const useManageOrders = () => {
	const auth = useContext(AuthContext);
	const orders = useOrders((state) => state);

	const getHeaders = (token?: {} | boolean | null) => {
		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${
				token ? token : auth.token ? auth.token : false
			}`,
		};
	};

	const updateCustomerOrder = async () => {
		const action = 'putCustomerOrder';
		const method = 'PATCH';
		const body = JSON.stringify({
			address_id: orders.deliveryAddressId,
			manual_address: orders.manualAddress,
			is_pickup: orders.isPickup,
			is_manual_address: orders.isManualAddress,
			pickup_date: orders.pickupDate,
			pickup_time: orders.pickupTime,
		});
		try {
			const data: ServerResponse = await httpFetch(
				getOrderUrl(action),
				method,
				body,
				getHeaders(auth.token)
			);
			return data;
		} catch (error: any) {
			console.error(error);
			throw new Error(error.message);
		}
	};

	const getOrder = async (auth: AuthContextIf) => {
		const action = 'get';
		const method = 'GET';

		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${auth.token}`,
		};
		try {
			const data: customerPickupOptions = await httpFetch(
				getOrderUrl(action),
				method,
				null,
				header
			);
			return data;
		} catch (error: any) {
			console.error(error);
			throw new Error(error.message);
		}
	};

	const getCustomerOrder = async (auth: AuthContextIf) => {
		const action = 'getOrder';
		const method = 'GET';

		const header = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${auth.token}`,
		};
		try {
			const data: customerOrders = await httpFetch(
				getOrderUrl(action),
				method,
				null,
				header
			);
			return data;
		} catch (error: any) {
			console.error(error);
			throw new Error(error.message);
		}
	};

	const deserializeManualAddress = (address: string): manualAddress => {
		const addressObject: manualAddress = JSON.parse(address);
		return addressObject;
	};

	const setOrderDetails = (order: customerCheckoutOptions) => {
		orders.setDeliveryInstructions(order.delivery_instructions);
		orders.setRequestedDeliveryDate(order.requested_delivery_date);
		orders.setOrderDate(order.order_date);
		orders.setPurchaseOrder(order.purchase_order);
		orders.setPickupDate(order.pickup_date);
		orders.setPickupTime(order.pickup_time);
		if (typeof order.manual_address === 'string') {
			orders.setManualAddress(
				deserializeManualAddress(order.manual_address)
			);
		} else {
			orders.setManualAddress(order.manual_address);
		}

		window.localStorage.setItem(
			'usersOrder',
			JSON.stringify({
				delivery_instructions: order.delivery_instructions
					? order.delivery_instructions
					: '',
				order_date: order.order_date ? order.order_date : '',
				requested_delivery_date: order.requested_delivery_date,
				purchase_order: order.purchase_order
					? order.purchase_order
					: '',
				pickup_date: order.pickup_date ? order.pickup_date : '',
				pickup_time: order.pickup_time ? order.pickup_time : '',
				manual_address: order.manual_address
					? order.manual_address
					: '',
			})
		);

		console.log('local storage', window.localStorage.getItem('usersOrder'));
	};

	const setOrderDetailsFromLocalStorage = () => {
		const order: customerCheckoutOptions =
			localStorage.getItem('usersOrder') &&
			JSON.parse(localStorage.getItem('usersOrder')!);
		if (order) {
			orders.setDeliveryInstructions(order.delivery_instructions);
			orders.setRequestedDeliveryDate(order.requested_delivery_date);
			orders.setOrderDate(order.order_date);
			orders.setPurchaseOrder(order.purchase_order);
			orders.setPickupDate(order.pickup_date);
			orders.setPickupTime(order.pickup_time);
			orders.setManualAddress(order.manual_address);
		}
	};

	const updateOrderDetail = (name: string, value: string) => {
		let savedOrders =
			window.localStorage.getItem('usersOrder') &&
			JSON.parse(window.localStorage.getItem('usersOrder') as string);
		if (savedOrders) {
			savedOrders[name] = value;
			window.localStorage.setItem(
				'usersOrder',
				JSON.stringify(savedOrders)
			);
		} else {
			savedOrders = { name: value };
			window.localStorage.setItem(
				'usersOrder',
				JSON.stringify(savedOrders)
			);
		}
	};

	return {
		setOrderDetails,
		setOrderDetailsFromLocalStorage,
		updateOrderDetail,
		updateCustomerOrder,
		getCustomerOrder,
		getOrder,
	};
};

export default useManageOrders;
