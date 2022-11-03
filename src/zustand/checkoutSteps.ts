import create from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

const checkoutNavigation = (isPickup: boolean) => {
	return {
		steps: {
			'shopping-cart': {
				backNav: '',
				nextNav: isPickup
					? '/checkout/billing-payment'
					: '/checkout/shipping-delivery',
			},
			'customer-info': {
				backNav: '/shopping-cart',
				nextNav: isPickup
					? '/checkout/billing-payment'
					: '/checkout/shipping-delivery',
			},
			'shipping-delivery': {
				backNav: '/checkout',
				nextNav: '/checkout/billing-payment',
			},
			'billing-payment': {
				backNav: isPickup ? '/checkout' : '/checkout/shipping-delivery',
				nextNav: '/checkout/confirmation',
			},
			confirmation: {
				backNav: '/checkout/billing-payment',
				nextNav: null,
			},
		} as { [key: string]: { backNav: string; nextNav: string | null } },
	};
};

type Store = {
	registerNewUser: boolean;
	registerGuestUser: boolean;
	loginUser: boolean;
	isPickup: boolean;
	back: string;
	next: string | null;
	currentStep: string;
	backStep: (backStep: string) => void;
	nextStep: (nextStep: string | null) => void;
	setCurrentStep: (currentStep: string) => void;
	currentNavigation: () => { backNav: string; nextNav: string | null };
	setPickup: (isPickup: boolean) => void;
};

const useCheckoutSteps = create<Store>((set, get) => ({
	registerNewUser: false,
	registerGuestUser: false,
	loginUser: false,
	isPickup: false,
	back: 'Back',
	next: 'Next',
	currentStep: '',
	setRegisterNewUser: (registerNewUser: boolean) =>
		set(() => ({ registerNewUser })),
	setRegisterGuestUser: (registerGuestUser: boolean) =>
		set(() => ({ registerGuestUser })),
	setLoginUser: (loginUser: boolean) => set(() => ({ loginUser })),
	backStep: (backStep: string) =>
		set((state) => ({
			back: backStep,
		})),
	nextStep: (nextStep: string | null) =>
		set((state) => ({
			next: nextStep,
		})),
	setCurrentStep: (currentStep: string) =>
		set((state) => ({
			currentStep,
		})),
	currentNavigation: (): { backNav: string; nextNav: string | null } => {
		const { currentStep, isPickup, backStep, nextStep } = get();
		const { steps } = checkoutNavigation(isPickup);
		const { backNav, nextNav } = steps[currentStep];
		backStep(backNav);
		nextStep(nextNav);
		return { backNav, nextNav };
	},
	setPickup: (isPickup: boolean) => set(() => ({ isPickup })),
}));

export default useCheckoutSteps;

if (process.env.NODE_ENV === 'development') {
	mountStoreDevtool('Store', useCheckoutSteps);
}
