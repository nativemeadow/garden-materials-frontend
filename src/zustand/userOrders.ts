import create, { GetState, SetState } from 'zustand';
import { Items } from '../shared/interfaces/items';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import {
	manualAddress,
	initialAddressInfo,
} from '../shared/interfaces/customerInfo';

export type Store = {
	id: number;
	orderDate: Date;
	Items: Array<Items>;
	loadFromCart: (items: Items[]) => void;
	clearOrders: () => void;
	orderCount: () => number;
	orderTotal: () => number;
	taxRate: number;
	deliveryInstructions: string;
	purchaseOrder: string;
	requestedDeliveryDate: string;
	isPaid: boolean;
	isDelivered: boolean;
	paymentMethod: string;
	createdAt: Date;
	updatedAt: Date;
	isDelivery: boolean;
	isManualAddress: boolean;
	deliveryAddressId: string;
	manualAddress: manualAddress;
	billingAddress: manualAddress;
	deliveryAddress: manualAddress;
	deliveryDistance: number;
	deliveryDuration: number;
	isPickup: boolean;
	pickupDate: string;
	pickupTime: string;
	confirmOrder: boolean;
	setOrderDate: (orderDate: Date) => void;
	setItems: (items: Items[]) => void;
	setTaxRate: (taxRate: number) => void;
	setDeliveryInstructions: (deliveryInstructions: string) => void;
	setPurchaseOrder: (purchaseOrder: string) => void;
	setRequestedDeliveryDate: (requestedDeliveryDate: string) => void;
	setIsPaid: (isPaid: boolean) => void;
	setIsDelivered: (isDelivered: boolean) => void;
	setIsDelivery: (isDelivery: boolean) => void;
	setDeliveryAddressId: (deliveryAddressId: string) => void;
	setIsManualAddress: (isManualAddress: boolean) => void;
	initializeManualAddress: (input: string) => void;
	setManualAddress: (manualAddress: manualAddress) => void;
	getManualAddress: () => manualAddress;
	setBillingAddress: (billingAddress: manualAddress) => void;
	getBillingAddress: () => manualAddress;
	setDeliveryAddress: (billingAddress: manualAddress) => void;
	getDeliveryAddress: () => manualAddress;
	setDeliveryDistance: (deliveryDistance: number) => void;
	setDeliveryDuration: (deliveryDuration: number) => void;
	setPaymentMethod: (paymentMethod: string) => void;
	setCreatedAt: (createdAt: Date) => void;
	setUpdatedAt: (updatedAt: Date) => void;
	setIsPickup: (isPickup: boolean) => void;
	setPickupDate: (pickupDate: string) => void;
	setPickupTime: (pickupTime: string) => void;
	hasRequestedDeliveryDate: () => boolean;
	hasDeliveryInstructions: () => boolean;
	reset: () => void;
};

const initialState = {
	id: 0,
	orderDate: new Date(),
	Items: [],
	taxRate: 0,
	deliveryInstructions: '',
	purchaseOrder: '',
	requestedDeliveryDate: '',
	isPaid: false,
	isDelivered: false,
	paymentMethod: '',
	createdAt: new Date(),
	updatedAt: new Date(),
	deliveryAddressId: '',
	manualAddress: initialAddressInfo.manualAddress,
	billingAddress: initialAddressInfo.manualAddress,
	deliveryAddress: initialAddressInfo.manualAddress,
	deliveryDistance: 0,
	deliveryDuration: 0,
	isDelivery: false,
	isManualAddress: false,
	isPickup: false,
	pickupDate: initialAddressInfo.pickup.date,
	pickupTime: initialAddressInfo.pickup.time,
	confirmOrder: false,
};

const useOrders = create<Store>((set, get) => ({
	...initialState,
	loadFromCart: (items: Items[]) => {
		set((state) => ({
			Items: items,
		}));
	},
	clearOrders: () => {
		set((state) => ({
			Items: [],
		}));
	},
	orderCount: () => {
		return get().Items.length;
	},
	orderTotal: () => {
		return get().Items.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
		);
	},
	setOrderDate: (orderDate: Date) => {
		set((state) => ({
			orderDate,
		}));
	},
	setItems: (items: Items[]) => {
		set((state) => ({
			Items: items,
		}));
	},
	setTaxRate: (taxRate: number) => {
		set((state) => ({
			taxRate,
		}));
	},
	setDeliveryInstructions: (deliveryInstructions: string) => {
		set((state) => ({
			deliveryInstructions,
		}));
	},
	setPurchaseOrder: (purchaseOrder: string) => {
		set((state) => ({
			purchaseOrder,
		}));
	},
	setRequestedDeliveryDate: (deliveryDate: string) => {
		set((state) => ({
			requestedDeliveryDate: deliveryDate,
		}));
	},
	setIsPaid: (isPaid: boolean) => {
		set((state) => ({
			isPaid,
		}));
	},
	setIsDelivered: (isDelivered: boolean) => {
		set((state) => ({
			isDelivered,
		}));
	},
	setPaymentMethod: (paymentMethod: string) => {
		set((state) => ({
			paymentMethod,
		}));
	},
	setCreatedAt: (createdAt: Date) => {
		set((state) => ({
			createdAt,
		}));
	},
	setUpdatedAt: (updatedAt: Date) => {
		set((state) => ({
			updatedAt,
		}));
	},
	setDeliveryAddressId: (deliveryAddressId: string) => {
		set((state) => ({
			deliveryAddressId,
		}));
	},
	setDeliveryDistance: (deliveryDistance: number) => {
		set((state) => ({
			deliveryDistance,
		}));
	},
	setDeliveryDuration: (deliveryDuration: number) => {
		set((state) => ({
			deliveryDuration,
		}));
	},
	setIsDelivery: (isDelivery: boolean) => {
		set((state) => ({
			isDelivery,
		}));
	},
	setIsManualAddress: (isManualAddress: boolean) => {
		set((state) => ({
			isManualAddress,
		}));
	},
	getManualAddress: () => {
		return get().manualAddress;
	},
	initializeManualAddress: (input: string) => {
		const address = JSON.parse(input);
		set((state) => ({
			...address,
		}));
	},
	setManualAddress: (manualAddress: manualAddress) => {
		set((state) => ({
			manualAddress,
		}));
	},
	getBillingAddress: () => {
		return get().billingAddress;
	},
	initializeBillingAddress: (input: string) => {
		const address = JSON.parse(input);
		set((state) => ({
			...address,
		}));
	},
	setBillingAddress: (billingAddress: manualAddress) => {
		set((state) => ({
			billingAddress,
		}));
	},
	getDeliveryAddress: () => {
		return get().deliveryAddress;
	},
	initializeDeliveryAddress: (input: string) => {
		const address = JSON.parse(input);
		set((state) => ({
			...address,
		}));
	},
	setDeliveryAddress: (deliveryAddress: manualAddress) => {
		set((state) => ({
			deliveryAddress,
		}));
	},
	setIsPickup: (isPickup: boolean) => {
		set((state) => ({
			isPickup,
		}));
	},
	setPickupDate: (pickupDate: string) => {
		set((_state) => ({
			pickupDate,
		}));
	},
	setPickupTime: (pickupTime: string) => {
		set((state) => ({
			pickupTime,
		}));
	},
	setConfirmOrder: (confirmOrder: boolean) => {
		set((state) => ({
			confirmOrder,
		}));
	},
	hasRequestedDeliveryDate: () => {
		return get().requestedDeliveryDate !== '';
	},
	hasDeliveryInstructions: () => {
		return get().deliveryInstructions !== '';
	},
	reset: () => {
		set(initialState);
	},
}));

export default useOrders;

if (process.env.NODE_ENV === 'development') {
	mountStoreDevtool('Store', useOrders);
}
