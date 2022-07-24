import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	selectAllCategories,
	getCategoriesStatus,
	getCategoriesError,
	fetchCategories,
} from './category-list-slice';
import { Category } from '../../shared/interfaces/category-list';

const TestRedux = () => {
	const dispatch = useDispatch();

	const categories = useSelector(selectAllCategories);
	const categoriesStatus = useSelector(getCategoriesStatus);
	// const catErrors = useSelector(getCategoriesError);

	useEffect(() => {
		if (categoriesStatus === 'idle') {
			dispatch(fetchCategories());
		}
	}, [categoriesStatus, dispatch]);

	return (
		<div>
			<h1>Test Redux</h1>
			{categories.status === 'succeeded' &&
				categories.categories.map((category: Category, key: number) => {
					return <li key={key}>{category.title}</li>;
				})}
		</div>
	);
};

export default TestRedux;
