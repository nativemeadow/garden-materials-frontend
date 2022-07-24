export type FormInput = {
	username: '';
	password: '';
	passwordConfirmation: '';
	first_name: '';
	last_name: '';
	email: '';
	phone: '';
	address: '';
	city: '';
	country: '' | 'US';
	state_province: '' | 'CA';
	postal_code: '';
	company: '';
};

export interface User {
	customer_type: 'registered' | 'guest';
	username: string;
	password: string;
	passwordConfirmation: string;
	first_name: string;
	last_name: string;
	address_id: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	country: string | 'US';
	state_province: string | 'CA';
	postal_code: string;
	company: string;
}

export interface ShippingAddress {
	name: string;
	address: string;
	city: string;
	country: string | 'US';
	state_province: string | 'CA';
	postal_code: string;
}

export interface BillingAddress {
	name: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	country: string | 'US';
	state_province: string | 'CA';
	postal_code: string;
}
