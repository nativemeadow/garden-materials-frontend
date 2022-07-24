import { useContext, useCallback } from 'react';
import httpFetch from '../http/http-fetch';
import { Items } from '../interfaces/items';
import configData from '../../config.json';
import { AuthContext } from '../context/auth-context';
import useOrders from '../../zustand/userOrders';

const getOrderUrl = (action: string): string => {
	const url = `${configData.BACKEND_URL}/orders`;
	switch (action) {
		case 'get':
			return `${url}/get`;
		case 'getOrder':
			return `${url}/getUserOrder`;
		case 'create':
			return `${url}/createOrder`;
		case 'update':
			return `${url}/updateOrder`;
		case 'delete':
			return `${url}/deleteOrder`;
		default:
			return url;
	}
};

type ServerResponse = { message: string; action: string; items?: [] };

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

	const get = async (token: boolean | null) => {
		return await httpFetch(
			getOrderUrl('get'),
			'GET',
			null,
			getHeaders(token)
		);
	};

	const updateOrder = async (order: any) => {};

	const setOrderDetails = (order: any) => {
		orders.setDeliveryInstructions(order.delivery_instructions);
		orders.setRequestedDeliveryDate(order.requested_delivery_date);
		orders.setOrderDate(order.order_date);
		orders.setPurchaseOrder(order.purchase_order);
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
			})
		);
	};

	const setDeliveryInstructions = async (
		deliveryInstructions: string,
		requestedDeliveryDate: string,
		po?: string
	) => {};

	return { setOrderDetails, setDeliveryInstructions };
};

export default useManageOrders;
