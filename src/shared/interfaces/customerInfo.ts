export type manualAddress = {
	name: string;
	address: string;
	city: string;
	state_province: string;
	country: string;
	postal_code: string;
};

export type pickup = {
	date: string;
	time: string;
};

export type addressContextType = {
	addressId?: string;
	manualAddress: manualAddress;
	pickup: pickup;
	// addressHandler?: () => void;
	// pickupHandler?: () => void;
};

export const initialAddressInfo: addressContextType = {
	addressId: '',
	manualAddress: {
		name: '',
		address: '',
		city: '',
		state_province: '',
		country: '',
		postal_code: '',
	},
	pickup: {
		date: '',
		time: '',
	},
	// addressHandler: () => {},
	// pickupHandler: () => {},
};
