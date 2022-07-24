import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import httpFetch from '../../shared/http/http-fetch';
import { parser } from '../../shared/util/html-parse';
import configData from '../../config.json';
import { BreadCrumbItem } from './breadcrumb-item';

import classes from './bread-crumbs.module.css';

type CategoryProps = { categoryId: string | undefined; productId?: string };

const BreadCrumbs: React.FC<CategoryProps> = ({ categoryId }) => {
	const {
		isLoading,
		isError,
		data: BreadCrumbItem,
		error,
	} = useQuery<BreadCrumbItem[], Error>(
		['breadcrumbs', categoryId],
		async () => {
			try {
				return await httpFetch<BreadCrumbItem[]>(
					`${configData.BACKEND_URL}/categories/hierarchy/${categoryId}`
				);
			} catch (error: any) {
				throw new Error(error);
			}
		}
	);

	if (isError) {
		return <div id={classes['bread-crumbs-wrapper']}>{error.message}</div>;
	}

	return (
		<div id={classes['bread-crumbs-wrapper']}>
			<div className={classes['bread-crumbs']}>
				<ul className={classes['bread-crumb']}>
					<li>
						<Link to='/'>Products</Link>
					</li>
					{BreadCrumbItem?.map((item) => {
						return (
							<li key={item.id} id={item.id}>
								<Link
									to={`/category/${
										item.url_key ? item.url_key : item.id
									}`}>
									{parser(item.title)}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default BreadCrumbs;
