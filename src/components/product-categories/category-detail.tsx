import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import parse from 'html-react-parser';

import httpFetch from '../../shared/http/http-fetch';
import configData from '../../config.json';
import { Category } from '../../shared/interfaces/category-list';
import BreadCrumbs from '../navigation/bread-crumbs';
import Products from './products';

import classes from './category-detail.module.css';

const CategoryDetail = () => {
	const categoryId = useParams().categoryId;
	console.log('Category Id:', categoryId);
	const [parentCategory, setParentCategory] = useState<Category>();
	const [categoryGroup, setCategoryGroup] = useState<Category[]>([]);

	const {
		isLoading,
		isError,
		data: categoryGroupData,
		error,
	} = useQuery<Category[], Error>(['subCatagories', categoryId], async () => {
		try {
			return await httpFetch<Category[]>(
				`${configData.BACKEND_URL}/categories/${categoryId}`
			);
		} catch (error: any) {
			throw new Error(error);
		}
	});

	useEffect(() => {
		setParentCategory(categoryGroupData?.shift());
		setCategoryGroup(categoryGroupData!);
	}, [categoryGroupData]);

	return (
		<>
			{categoryGroup && <BreadCrumbs categoryId={categoryId} />}
			<div className={classes['category-detail']}>
				{isLoading && (
					<div className='center'>
						<LoadingSpinner asOverlay />
					</div>
				)}
				{/* <ErrorModal error={error} onClear={clearError} /> */}
				{isError && <div className='error'>{error?.message}</div>}
				<h1
					className={`${classes['category-detail__heading']} ${classes['category-detail__title']}`}>
					{parentCategory?.title}
				</h1>
				<div className={classes['category-detail__description']}>
					{parentCategory?.description?.length &&
						parse(parentCategory?.description)}
				</div>
				{/* <div className={classes['category__list']}></div> */}

				<div className={classes['group']}>
					{categoryGroup?.map((item) => {
						return (
							<div
								key={item.id}
								className={classes['image-container']}>
								<Link to={`/category/${item.url_key}`}>
									<img
										src={`${configData.IMAGES}/product-categories/${item.image}`}
										alt={item.title}
									/>
								</Link>
								<h2 className={classes['category-title']}>
									<Link to={`/category/${item.url_key}`}>
										{item.title}
									</Link>
								</h2>
							</div>
						);
					})}

					<Routes>
						<Route
							path={`/category/:categoryId/*`}
							element={<CategoryDetail />}
						/>
					</Routes>
				</div>
				<Products
					categoryId={parentCategory?.id}
					url_key={parentCategory?.url_key}
				/>
			</div>
		</>
	);
};

export default CategoryDetail;
