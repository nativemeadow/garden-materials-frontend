export type Items = {
	category_id: number | undefined;
	product_id: number | undefined;
	cart_id?: number | undefined;
	item_id?: number | undefined;
	sku: string | undefined;
	title: string | undefined;
	image: string | undefined;
	price: number;
	quantity: number;
	unit: string | undefined;
	color?: string | undefined;
};
