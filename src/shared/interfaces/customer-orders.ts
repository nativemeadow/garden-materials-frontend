import { Items } from './items';
import { manualAddress, initialAddressInfo } from './customerInfo';

export type ServerResponse = {
	message: string;
	action: string;
	order?: { items: Array<Items> };
};

export type customerPickupOptions = {
	pickup_date: string;
	pickup_time: string;
};

export type customerCheckoutOptions = {
	order_date: Date;
	delivery_instructions: string;
	purchase_order: string;
	requested_delivery_date: string;
	delivery_addressId?: string;
	manual_address: manualAddress;
	isPickup: boolean;
	pickup_date: string;
	pickup_time: string;
};
