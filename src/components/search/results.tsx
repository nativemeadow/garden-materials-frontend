import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import httpFetch from '../../shared/http/http-fetch';
import configData from '../../config.json';
import parse from 'html-react-parser';
import { round } from '../../shared/util/math-utilities';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { ProductArrayBuilder } from '../product-categories/product-builder';
import ProductCard from '../product-categories/product-card';
import { Product } from '../../shared/interfaces/product';

import classes from './results.module.css';
import productClasses from '../product-categories/products.module.css';

const Results: React.FC = () => {
	const { searchTerm } = useParams();
	const [products, setProducts] = useState<Product[]>();
	const {
		isLoading,
		isError,
		data: searchResults,
		error,
	} = useQuery<Product[], Error>(['search', searchTerm], async () => {
		try {
			return await httpFetch<Product[]>(
				`${configData.BACKEND_URL}/search/products`,
				'POST',
				JSON.stringify({ search: searchTerm }),
				{ 'Content-Type': 'application/json' },
				'omit'
			);
		} catch (error: any) {
			throw new Error(error);
		}
	});

	useEffect(() => {
		searchResults && setProducts(ProductArrayBuilder(searchResults));
	}, [searchResults]);

	return (
		<div className={classes['search-results-grid']}>
			{isLoading && (
				<div className='center'>
					<LoadingSpinner asOverlay />
				</div>
			)}
			{isError && <div className='error'>{error?.message}</div>}
			<div>
				<h1>Search Results</h1>
				<div className={classes['terms']}>
					<span>Search term:</span> {searchTerm}
				</div>
				<div className={'flex gap-4'}>
					<div className='w-1/4 border-2 rounded-lg border-gray-300 border-solid'></div>
					<div className={classes['products__group']}>
						{products?.map((item, index) => {
							return (
								<div
									key={index}
									className={classes['card-width']}>
									<ProductCard
										product={item}
										categoryId={item.categoryUrlKey}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Results;
