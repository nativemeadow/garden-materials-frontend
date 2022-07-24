import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { Product, Pricing } from '../../../shared/interfaces/product';
import { selectListOptions } from './product-detail';
import ProductExtended from './product-extended';
import useStore from '../../../zustand/store';

import parse from 'html-react-parser';
import classes from './product-detail.module.css';

type Props = {
	products: Product;
	productSize: string;
	productQty: number;
	selectedValue: string;
	selectList: selectListOptions[];
	productThumbs: Pricing[] | undefined;
	productOptions: string;
	setProductQty: Dispatch<SetStateAction<number>>;
	addToCartHandler: (event: React.FormEvent<HTMLFormElement>) => void;
	productSelectHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const ProductForm: React.FC<Props> = ({
	products,
	productSize,
	productQty,
	selectedValue,
	selectList,
	productThumbs,
	productOptions,
	setProductQty,
	addToCartHandler,
	productSelectHandler,
}) => {
	const [selectDetails, setSelectDetails] = useState(<></>);
	const { extendedValue, extendedRules } = useStore();

	// const setTheStep = (unit: string | undefined) => {
	// 	const unitsArray = ['lbs', 'ton', 'tons', 'yds', 'yds', 'ft', 'cu ft'];
	// 	if (!unit) {
	// 		return 1;
	// 	}

	// 	for (const unitsElement of unitsArray) {
	// 		const value = unit.search(unitsElement);
	// 		if (value !== -1) {
	// 			return '0.01';
	// 		}
	// 	}

	// 	return '1';
	// };

	useEffect(() => {
		let selection = <></>;

		selection = productSize.includes('sk') ? (
			<div className={classes['product-quantity__selection--message']}>
				<p>
					Currently this product is not available for purchase online
					in the selected quantity. Please select a different option
					or visit our store to purchase this quantity.
				</p>
			</div>
		) : (
			<div className={classes['product-quantity__selection']}>
				<input
					className={classes['quantity_entry']}
					type='number'
					min='1'
					step='any'
					name='cart_qty'
					value={productQty.toFixed(2)}
					onChange={(event) =>
						setProductQty(parseInt(event.target.value, 10))
					}
					disabled={productSize.length <= 0}
				/>
				<div className={classes['product-quantity__selection--units']}>
					{/* {!productThumbs
						? productSize
						: removeDuplicateCharacters(productSize)} */}
				</div>
				<div className={classes['product-quantity__selection--button']}>
					<button type='submit' disabled={productSize.length <= 0}>
						Add to Cart
					</button>
				</div>
			</div>
		);
		setSelectDetails(selection);
	}, [productSize, productQty, productThumbs, setProductQty]);

	useEffect(() => {
		console.log('extendedValue', extendedValue);
	}, [extendedValue]);

	return (
		<form name='addToCart' onSubmit={addToCartHandler}>
			<div className={classes['product-detail__selection']}>
				{products?.pricing.length! > 0 && (
					<p className={classes['product-detail__select--options']}>
						{parse(productOptions)}
					</p>
				)}
				{products.extended && <ProductExtended products={products} />}
				{products?.pricing.length! > 1 && (
					<select
						name='product_select'
						value={selectedValue}
						onChange={productSelectHandler}
						className={`${classes['products-detail-pricing__select']} form-select `}
						disabled={
							!!products.extended && extendedValue.length === 0
						}>
						<option value=''>Select size</option>
						{selectList.map((price, key) => {
							return (
								<option
									key={key}
									value={price.description + price.units}>
									{price.description}
								</option>
							);
						})}
					</select>
				)}
				{products?.pricing.length! === 1 && (
					<input
						type='hidden'
						name='product_select'
						value={selectedValue}
					/>
				)}
			</div>

			{selectDetails}
		</form>
	);
};

export default ProductForm;
