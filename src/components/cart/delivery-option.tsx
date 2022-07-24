import React, { useState } from 'react';
import configData from '../../config.json';
import useOrders from '../../zustand/userOrders';
import useShoppingCart from '../../zustand/shoppingCart';
import DeliveryInstructions from './delivery-instructions';
import useManageOrders from '../../shared/hooks/use-manageOrders';
import { formatDate } from '../../shared/util/date-utils';

import classes from './shopping-cart.module.css';
import './shopping-cart.css';

// function formateDate(date: string) {
// 	if (date.length === 0) {
// 		return date;
// 	}
// 	const newData = new Date(date);
// 	return newData.toISOString().split('T')[0];
// }

export default function DeliveryPickupOption() {
	const shoppingCart = useShoppingCart((state) => state);
	const userOrders = useOrders((state) => state);
	const manageOrders = useManageOrders();
	const { hasDeliveryInstructions, hasRequestedDeliveryDate } = useOrders();

	const [showDeliveryComments, setShowDeliveryComments] = useState(false);

	const addDeliveryCommentHandler = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		event.preventDefault();
		console.log('delivery notes:', userOrders.deliveryInstructions);
		setShowDeliveryComments(false);
	};

	const openDeliveryComments = (
		event: React.FormEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		setShowDeliveryComments(true);
	};

	const handleDeliveryDate = (event: React.ChangeEvent<HTMLInputElement>) => {
		const deliveryDate = event.target.value;
		userOrders.setRequestedDeliveryDate(deliveryDate);
	};

	const onBlurDeliveryDate = (event: React.ChangeEvent<HTMLInputElement>) => {
		const deliveryDate = event.target.value;
		userOrders.setRequestedDeliveryDate(deliveryDate);
		manageOrders.updateOrderDetail(event.target.name, deliveryDate);
	};

	return (
		<div className='options'>
			<DeliveryInstructions
				showDeliveryComments={showDeliveryComments}
				setShowDeliveryComments={setShowDeliveryComments}
				addDeliveryCommentHandler={addDeliveryCommentHandler}
			/>
			<div className={classes['checkout__delivery-group']}>
				<h4 className={classes['checkout__delivery-group-title']}>
					Delivery Instructions / Information
				</h4>
				<span className={classes['checkout__delivery-alert']}>
					Delivery date and Instructions are required to proceed to
					checkout
				</span>
			</div>
			<div className={classes['checkout__delivery-container']}>
				<div className={classes['checkout__delivery-info-container']}>
					<div className={classes['checkout__delivery-date']}>
						<div>
							<label>Requested Delivery Date</label>
							<p>(Required)</p>
						</div>
						<div>
							<input
								className={classes['requested__delivery-date']}
								type='date'
								name='requested_delivery_date'
								value={formatDate(
									userOrders.requestedDeliveryDate
								)}
								onChange={handleDeliveryDate}
								onBlur={onBlurDeliveryDate}
								disabled={shoppingCart.cartIsEmpty()}
							/>
						</div>
					</div>
					<div className={classes['checkout__delivery-notice']}>
						We try our very best to accommodate your requested
						delivery date, however, due to traffic conditions,
						weather, etc., we do not guarantee any delivery dates or
						times. Often times, we are able to deliver before your
						requested date. Our staff will contact you to confirm
						your delivery date and time within 1 business day. No
						deliveries will be made on weekends and Holidays.
					</div>
					<p className={classes['checkout__delivery-notice-all']}>
						Notice: All Deliveries will have a 48-hour lead up and
						delivery will only be available Monday - Friday.
					</p>
					<div className={classes['checkout__delivery-date']}>
						<div>
							<label>Delivery Instructions</label>
							<p>(Required)</p>
						</div>
						<div>
							<button
								className={
									classes[
										'checkout__delivery-instructions-button'
									]
								}
								onClick={openDeliveryComments}
								disabled={shoppingCart.cartIsEmpty()}>
								Edit Delivery Notes
							</button>
						</div>
					</div>
				</div>
				<div className={classes['checkout__button--container']}>
					<button
						type='submit'
						className={classes['checkout__button']}
						disabled={
							shoppingCart.cartIsEmpty() ||
							!hasDeliveryInstructions() ||
							!hasRequestedDeliveryDate()
						}>
						Check Out
					</button>
				</div>
			</div>
		</div>
	);
}
