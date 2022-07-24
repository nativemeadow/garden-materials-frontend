import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import httpFetch from '../../shared/http/http-fetch';
import { Product } from '../../shared/interfaces/product';
import configData from '../../config.json';
import { ProductArrayBuilder } from './product-builder';
import ProductCard from './product-card';

import classes from './products.module.css';

const Products = (props: {
	categoryId: string | undefined;
	url_key?: string;
}) => {
	const categoryId = props.categoryId;
	const [products, setProducts] = useState<Product[]>();
	categoryId && console.log('Category Id:', categoryId);

	const {
		isLoading,
		isError,
		data: productData,
		error,
	} = useQuery<Product[], Error>(['products', categoryId], async () => {
		try {
			return await httpFetch<Product[]>(
				`${configData.BACKEND_URL}/categories/product-pricing/${categoryId}`
			);
		} catch (error: any) {
			throw new Error(error);
		}
	});

	useEffect(() => {
		productData && setProducts(ProductArrayBuilder(productData));
	}, [productData]);

	return (
		<>
			{products?.length === 0 && <></>}
			<div className={classes['products-detail']}>
				{isLoading && (
					<div className='center'>
						<LoadingSpinner asOverlay />
					</div>
				)}
				{/* <ErrorModal error={error} onClear={clearError} /> */}
				{isError && <div className='error'>{error?.message}</div>}
				<div className={classes['products__group']}>
					{products?.map((item, index) => {
						return (
							<div key={index} className={classes['card-width']}>
								<ProductCard
									product={item}
									categoryId={props.url_key}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default Products;
