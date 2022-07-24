import React, { useState, useEffect } from 'react';
import { Product, ProductExtensions } from '../../../shared/interfaces/product';
import useStore from '../../../zustand/store';

import classes from './product-detail.module.css';

interface Props {
	products: Product;
}

export default function ProductExtended(props: Props) {
	const [extended, setExtended] = useState<ProductExtensions[]>(
		{} as ProductExtensions[]
	);
	const [selected, setSelected] = useState('');
	const { extendedValue, extendedRules, setExtendedValue, setExtendedRules } =
		useStore();
	const extendedInfo = extended[0];

	useEffect(() => {
		console.log('extendedValue', extendedValue);
		console.log('extendedRules', extendedRules);
	}, [extendedValue, extendedRules]);

	useEffect(() => {
		setExtended(JSON.parse(props.products.extended));
	}, [props.products.extended]);

	const updateExtendedHandler = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setSelected(event.target.value);
		setExtendedValue(event.target.value);
		setExtendedRules(extendedInfo.rules);
	};

	const createExtendedInput = () => {
		if (!extendedInfo) {
			return <></>;
		}

		console.log(`JSON :`, extendedInfo);
		console.log('Labels:', extendedInfo.labels);

		return (
			<select
				name={`product_${extendedInfo.name}`}
				value={selected}
				onChange={updateExtendedHandler}
				className={`${classes['products-detail-pricing__select']}`}>
				{extendedInfo.labels.map((item, index) => {
					return (
						<option key={index} value={item}>
							{item}
						</option>
					);
				})}
			</select>
		);
	};

	return <div className='mb-2'>{createExtendedInput()}</div>;
}
