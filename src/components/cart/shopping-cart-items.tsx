import React from 'react';
import { Link } from 'react-router-dom';

import { Items } from '../../shared/interfaces/items';

import CalCost from './calculate-cost';
import configData from '../../config.json';

import classes from './shopping-cart.module.css';
interface Props {
	items: Array<Items>;
	setTheStep?: (unit: string) => string;
	onQuantityChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	removeHandler?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ShoppingCartItems = (props: Props) => {
	const { dollarUSLocale, calculateCost } = CalCost();
	return (
		<>
			{props.items.map((order: Items, key: number) => {
				return (
					<div
						key={key}
						className={classes['shopping-cart__order--items']}>
						<div
							className={
								classes[
									'shopping-cart__order--items-image-title'
								]
							}>
							<Link
								to={`/category/${order.category_id}/product/${order.product_id}/sku/${order.sku}`}>
								{order.image ? (
									<img
										src={`${configData.IMAGES}/products/${order.image}`}
										alt={
											order.title !== undefined
												? order.title
												: ''
										}
									/>
								) : (
									// <Image
									// 	src={[
									// 		`${configData.IMAGES}/products/${order.image}`,
									// 		`${configData.IMAGES}/products/default_image.png`,
									// 	]}
									// 	alt={
									// 		order.title !==
									// 		undefined
									// 			? order.title
									// 			: ''
									// 	}
									// />
									<img
										src={`${configData.IMAGES}/products/default_image.png`}
										alt={order.title}
									/>
								)}

								<p
									className={
										classes[
											'shopping-cart__order--items-title'
										]
									}>
									{order.title}
								</p>
							</Link>
						</div>

						<div
							className={
								classes['shopping-cart__order--item-cell']
							}>
							<div>{order.sku}</div>
							{order.color && <div>{order.color}</div>}
						</div>
						<div
							className={
								classes['shopping-cart__order--item-cell']
							}>
							${order.price.toFixed(2)}
						</div>
						<div
							className={`${classes['shopping-cart__order--item-input-container']}`}>
							{props.onQuantityChange && props.setTheStep ? (
								<input
									type='number'
									data-order-index={key}
									data-item-id={order.item_id}
									min='1'
									step={props?.setTheStep(order.unit!)}
									name={`cart_qty_${key}`}
									value={order.quantity}
									disabled={false}
									onChange={props?.onQuantityChange}
									className={
										classes[
											'shopping-cart__order--quantity-input'
										]
									}
								/>
							) : (
								<input
									type='number'
									disabled={true}
									value={order.quantity}
									className={
										classes[
											'shopping-cart__order--quantity-input'
										]
									}
								/>
							)}
							<p>{order.unit}</p>
						</div>
						<div
							className={
								classes['shopping-cart__order--item-total-cost']
							}>
							<p>
								$
								{dollarUSLocale.format(
									calculateCost(
										order.quantity,
										order.price,
										true
									)
								)}
							</p>
							{props.removeHandler && (
								<button
									className={
										classes[
											'shopping-cart__order--item-remove'
										]
									}
									onClick={props.removeHandler}
									name={`${key}`}
									data-item-id={order.item_id}>
									Remove
								</button>
							)}
						</div>
					</div>
				);
			})}
		</>
	);
};

export default ShoppingCartItems;
