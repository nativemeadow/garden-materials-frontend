import React from 'react';
import { Link } from 'react-router-dom';
import { parser } from '../../shared/util/html-parse';
import { Product } from '../../shared/interfaces/product';
import configData from '../../config.json';
import { round } from '../../shared/util/math-utilities';

import classes from './product-card.module.css';

const filterPricing = (product: Product, categoryId: string | undefined) => {
	const filterPrices = product?.pricing.filter((value, index, array) => {
		return index === array.findIndex((t) => t.price === value.price);
	});

	return filterPrices?.map((price, key) => {
		return (
			<Link
				key={`link-${Math.random()}-${product.sku}`}
				to={`/category/${categoryId}/product/${product.url_key}`}>
				<li key={key} id={`price-${price.key}`}>
					<span className={classes['product-card-pricing-usd']}>
						{price.price.toFixed(2)}
					</span>
					&nbsp;/
					{parser(price.units)}
				</li>
			</Link>
		);
	});
};

const ProductCard: React.FC<{
	product: Product;
	categoryId: string | undefined;
}> = ({ product, categoryId }) => {
	return (
		<div className={classes['product-card']}>
			<div className={classes['product-card--container']}>
				<div className={classes['product-card--image']}>
					<Link
						to={`/category/${categoryId}/product/${product.url_key}`}>
						{/* <Image
                    src={[
                        `${configData.IMAGES}/products/${product.image}`,
                        `${configData.IMAGES}/products/default_image.psd`,
                    ]}
                    alt={
                        product.title !== undefined
                            ? product.title
                            : ''
                    }
                	/> */}
						<img
							src={`${configData.IMAGES}/products/${product.image}`}
							loading='lazy'
							alt={
								product.title !== undefined ? product.title : ''
							}
						/>
					</Link>
				</div>
				<div className={classes['product-card__content']}>
					<h2 className={classes['product-card-title']}>
						<Link
							to={`/category/${categoryId}/product/${product.url_key}`}>
							{parser(product.title.toUpperCase())}
						</Link>
					</h2>
					<div className={classes['product-car__price-info']}>
						<ul className={classes['product-card-pricing']}>
							{filterPricing(product, categoryId)}
							{product.relevance !== undefined ? (
								<li
									className={
										classes['product-card-relevance']
									}>
									Relevance: {round(product.relevance)}
								</li>
							) : (
								''
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
