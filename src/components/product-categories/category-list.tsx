import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { parser } from '../../shared/util/html-parse';
import httpFetch from '../../shared/http/http-fetch';
import { Category } from '../../shared/interfaces/category-list';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import configData from '../../config.json';
import classes from './category-list.module.css';

const CategoryList = () => {
	const {
		isLoading,
		isError,
		data: categoryGroup,
		error,
	} = useQuery<Category[], Error>(['categories'], async () => {
		try {
			return await httpFetch<Category[]>(
				`${configData.BACKEND_URL}/categories`
			);
		} catch (error: any) {
			throw new Error(error);
		}
	});

	const gridItem = 'product-gallery__';
	return (
		<div className={classes['product-gallery']}>
			<h1 className='page_title'>Browse Our Landscaping Materials</h1>
			{isLoading && (
				<div className='center'>
					<LoadingSpinner asOverlay />
				</div>
			)}
			{isError && <div className='error'>{error?.message}</div>}
			<div className={classes['product-gallery__grid']}>
				{categoryGroup?.map((item) => {
					return (
						<div
							key={item.id}
							className={classes[`${gridItem}${item.url_key}`]}>
							<Link
								className={classes['product-gallery__link']}
								to={`/category/${item.url_key}`}>
								<div
									className={
										classes['product-gallery__item']
									}>
									<img
										src={`${configData.IMAGES}/product-categories/${item.image}`}
										alt={item.title}
									/>
									<span
										className={`${classes['product-gallery__card']}`}>
										{parser(item.title)}
									</span>
								</div>
							</Link>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default CategoryList;
