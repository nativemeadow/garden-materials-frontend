import { fireEvent } from '@testing-library/react';

export interface JSON {
	width: string;
	height: string;
}
export interface Pricing {
	key: number;
	sku: string;
	title: string;
	description: string;
	image: string;
	price: number;
	size?: string;
	units: string;
	coverage: string;
	coverage_value: number;
	online_minimum: number;
}

export interface Product {
	categoryId?: string;
	categoryUrlKey?: string;
	id: number;
	sku: string;
	url_key: string;
	title: string;
	description: string;
	image: string;
	imageLensSize: string;
	extended: string;
	relevance?: number;
	pricing: Pricing[];
}

type actionType = 'append' | 'prepend' | 'replace' | 'add' | 'remove';
interface field {
	field: string;
	action: actionType;
	hyphen?: boolean;
}

interface output {
	fields: Array<field>;
}

export interface rule {
	output: Array<output>;
}

export interface ProductExtensions {
	name: string;
	title: string;
	input: { type: string };
	labels: Array<string>;
	values: Array<string>;
	rules: Array<rule>;
}
