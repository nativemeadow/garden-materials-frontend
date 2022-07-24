import { Product } from '../../shared/interfaces/product';

function ProductBuilder(prod: Product) {
	const currentProduct: Product = {
		categoryId: prod.categoryId,
		categoryUrlKey: prod.categoryUrlKey,
		id: prod.id,
		url_key: prod.url_key,
		sku: prod.sku,
		title: prod.title,
		description: prod.description,
		image: prod.image,
		imageLensSize: prod.imageLensSize,
		extended: prod.extended,
		pricing: prod.pricing,
		relevance: prod.relevance,
	};
	return currentProduct;
}

export function ProductArrayBuilder(prodData: Product[]) {
	const currentProducts: Product[] = [];
	prodData.forEach((prod: Product) => {
		currentProducts.push(ProductBuilder(prod));
	});
	return currentProducts;
}

export default ProductBuilder;
