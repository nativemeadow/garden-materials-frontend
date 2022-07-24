import create from 'zustand';
import { rule } from '../shared/interfaces/product';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type Store = {
	extendedValue: string;
	setExtendedValue: (value: string) => void;
	extendedRules: Array<rule>;
	setExtendedRules: (rules: Array<rule>) => void;
	removeExtendedValue: () => void;
	removeExtendedRule: () => void;
};

const useStore = create<Store>((set) => ({
	extendedValue: '', // extended value is the value of the extended field
	setExtendedValue: (value: string) =>
		set((state) => ({ extendedValue: value })),
	extendedRules: [],
	setExtendedRules: (rules: Array<rule>) =>
		set((state) => ({ extendedRules: rules })),
	removeExtendedValue: () => set((state) => ({ extendedValue: '' })),
	removeExtendedRule: () => set((state) => ({ extendedRules: [] })),
}));

if (process.env.NODE_ENV === 'development') {
	mountStoreDevtool('Store', useStore);
}

export default useStore;
