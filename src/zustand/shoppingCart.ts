import create from 'zustand';
import { Items } from '../shared/interfaces/items';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type Store = {
	Items: Array<Items>;
	newItem: Items | {};
	loadCart: (items: Items[]) => void;
	addItem: (newItem: Items) => void;
	updateItem: (id: number, quantity: number) => void;
	removeItem: (id: number) => void;
	clearCart: () => void;
	cartCount: () => number;
	cartTotal: () => number;
	cartIsEmpty: () => boolean;
};

const useShoppingCart = create<Store>((set, get) => ({
	Items: [],
	newItem: {},
	loadCart: (items: Items[]) => set((state) => ({ Items: items })),
	addItem: (newItem: Items) =>
		set((state) => {
			state.Items = [...state.Items, newItem];
			console.log(' store items ', state.Items);
		}),
	updateItem: (id: number, quantity: number) => {
		set((state) => {
			const cartItem = state.Items.find((item) => item.item_id === id);
			if (cartItem) {
				cartItem.quantity = quantity;
			}
			state.Items = [...state.Items];
		});
	},
	removeItem: (id: number | string) =>
		set((state) => ({
			Items: state.Items.filter((item) => item.item_id !== id),
		})),
	clearCart: () => set((state) => ({ Items: [] })),
	cartCount: () => {
		return get().Items.length;
	},
	cartTotal: () => {
		return get().Items.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
	},
	cartIsEmpty: () => {
		return get().Items.length === 0;
	},
}));

export default useShoppingCart;

if (process.env.NODE_ENV === 'development') {
	mountStoreDevtool('Store', useShoppingCart);
}
