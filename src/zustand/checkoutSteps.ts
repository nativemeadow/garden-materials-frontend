import create from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type Store = {
	back: string;
	next: string;
	backStep: (backStep: string) => void;
	nextStep: (nextStep: string) => void;
};

const useCheckoutSteps = create<Store>((set, get) => ({
	back: 'Back',
	next: 'Next',
	backStep: (backStep: string) =>
		set((state) => ({
			back: backStep,
		})),
	nextStep: (nextStep: string) =>
		set((state) => ({
			next: nextStep,
		})),
}));

export default useCheckoutSteps;

if (process.env.NODE_ENV === 'development') {
	mountStoreDevtool('Store', useCheckoutSteps);
}
