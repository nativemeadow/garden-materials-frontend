import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from 'react-query';
import { Items } from '../../../shared/interfaces/items';
import useOrders from '../../../zustand/userOrders';
import useCart from '../../../zustand/shoppingCart';
import httpFetch from '../../../shared/http/http-fetch';

import configData from '../../../config.json';
import classes from '../shopping-cart.module.css';
import ShoppingCartItems from '../shopping-cart-items';
import useManageOrders from '../../../shared/hooks/use-manageOrders';
import {} from '../../../zustand/userOrders';
import { AuthContext } from '../../../shared/context/auth-context';
import { ServerResponse as customerOrder } from '../../../shared/interfaces/customer-orders';
import CalCost from '../calculate-cost';
import { round } from '../../../shared/util/math-utilities';

import billingClasses from './billing-payment.module.css';

const getWeekDay = (date: Date) => {
	const day = date.getDay();

	const weekDays = new Array(7);
	weekDays[0] = 'Sunday';
	weekDays[1] = 'Monday';
	weekDays[2] = 'Tuesday';
	weekDays[3] = 'Wednesday';
	weekDays[4] = 'Thursday';
	weekDays[5] = 'Friday';
	weekDays[6] = 'Saturday';

	return weekDays[day];
};

const formateDateAndTime = (date: string, time: string) => {
	const dateObj = new Date(date);
	const weekDay = getWeekDay(dateObj);
	const month = dateObj.getMonth() + 1;
	const day = dateObj.getDate();
	const year = dateObj.getFullYear();
	const formattedDate = `${weekDay}, ${month}/${day}/${year}`;
	const hour: number = +time.split(':')[0];
	const formattedTime = hour > 11 ? `${time} PM` : `${time} AM`;

	return `${formattedDate} at ${formattedTime}`;
};

const BillingPayment = () => {
	const auth = useContext(AuthContext);
	const userOrders = useOrders((state) => state);
	const { Items, cartTotal } = useCart((state) => state);
	const [totalCost, setTotalCost] = useState(0);
	const billingAddress = userOrders.billingAddress;
	const deliveryAddress = userOrders.deliveryAddress;
	const { dollarUSLocale } = CalCost();
	const [formattedDeliveryDate] = useState(() => {
		const month = userOrders.requestedDeliveryDate.split('-')[1];
		const day = userOrders.requestedDeliveryDate.split('-')[2];
		const year = userOrders.requestedDeliveryDate.split('-')[0];
		return `${month}/${day}/${year}`;
	});
	const [formattedDeliveryCost, setFormattedDeliveryCost] =
		useState<number>();

	let pickupDeliveryTitle = userOrders.isPickup
		? 'Customer Information'
		: 'Delivery Information';

	useEffect(() => {
		const tax = cartTotal() * configData.SALES_TAX;
		type deliveryFee = { deliveryCost: number };

		const deliveryCostRate = async () => {
			const headers = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${auth.token}`,
			};

			try {
				return (await httpFetch(
					`${configData.BACKEND_URL}/orders/updateDeliveryCost`,
					'PUT',
					JSON.stringify({
						deliveryDistanced: userOrders.deliveryDistance,
					}),
					headers
				)) as deliveryFee;
			} catch (error) {
				console.log('Error', error);
			}
		};

		if (!userOrders.isPickup) {
			deliveryCostRate().then((res: any) => {
				const deliveryCost = res.order.deliveryCost;
				setTotalCost(round(cartTotal() + tax + deliveryCost!));
				setFormattedDeliveryCost(round(deliveryCost));
			});
		} else {
			setTotalCost(round(cartTotal() + tax));
		}
	}, []);

	return (
		<>
			<h1 className={billingClasses.heading}>Review & Payment</h1>
			<div className={billingClasses['review-msg']}>
				{userOrders.isPickup && (
					<span>
						PLEASE NOTE: In Store Pickup orders will have a 72-hour
						lead time to be processed. You will receive a phone call
						from our sales representative to confirm your order
						details within 1 business day
					</span>
				)}
				{userOrders.isDelivery && (
					<span>
						PLEASE NOTE: We can accommodate up to 3 materials in one
						truck/delivery. However, there is a maximum weight limit
						and yardage capacity per truck. Minimum online order
						needs to be either 1 ton or 1 cubic yard of any
						materials. Delivery Estimate shown here is for 1 truck
						load only. Due to increased fuel costs, there will be a
						Fuel Surcharge added to all delivery fees. Our sales
						representative will contact you to verify your order and
						will let you know if an additional delivery fee is
						applicable.
					</span>
				)}
			</div>
			<div className={classes['shopping-cart']}>
				<div className={classes['shopping-cart-grid']}>
					<ShoppingCartItems items={Items} />
				</div>
				<div
					className={`${billingClasses['order-subtotal']} px-4 py-4`}>
					<div className={classes['order-subtotal']}>
						<h4 className={billingClasses['summary-title']}>
							Order Summary
						</h4>
						<p className='mt-2'>
							$&nbsp;{dollarUSLocale.format(totalCost)}
						</p>
						<div
							className={`grid grid-cols-2 ${billingClasses['payment_subtotals']}`}>
							<h6>Sub-total</h6>
							<div>
								$&nbsp;{dollarUSLocale.format(cartTotal())}
							</div>
							{!userOrders.isPickup && (
								<>
									<h6 className=' mt-2'>Delivery</h6>
									<div className=' mt-2'>
										$&nbsp;
										{dollarUSLocale.format(
											formattedDeliveryCost as number
										)}
									</div>
								</>
							)}
							<h6 className='mt-2'>Tax</h6>
							<div className='mt-2'>
								$&nbsp;
								{round(cartTotal() * configData.SALES_TAX)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='mt-6 flex flex-1 '>
				<div className={`flex flex-col ${billingClasses.review}`}>
					<h4 className=' font-semibold'>{pickupDeliveryTitle}</h4>
					{userOrders.isPickup ? (
						<>
							<div>
								Store Pickup on&nbsp;
								{userOrders.pickupDate &&
									formateDateAndTime(
										userOrders.pickupDate,
										userOrders.pickupTime
									)}
							</div>
							<div>
								{auth.firstName} {auth.lastName}&nbsp;
								{auth.username}
							</div>
							<div>{auth.email}</div>
							<div>{auth.phone}</div>
						</>
					) : (
						<>
							<div>
								{auth.firstName} {auth.lastName}
							</div>
							<div>{deliveryAddress.address}</div>
							<div>
								{deliveryAddress.city},
								{deliveryAddress.postal_code}
							</div>
							<div>{deliveryAddress.state_province}</div>
							<h4 className='mt-2 font-semibold'>
								Delivery Instructions / Notes
							</h4>
							<div>{userOrders.deliveryInstructions}</div>
							<h4 className='mt-2 font-semibold'>
								Delivery Date
							</h4>
							<div>{formattedDeliveryDate}</div>
						</>
					)}
				</div>
				<div className={`flex flex-col ml-6 ${billingClasses.review}`}>
					<h4 className='font-semibold'>Billing Information</h4>
					<div>
						{auth.firstName} {auth.lastName}
					</div>
					<div>{billingAddress.address}</div>
					<div>
						{billingAddress.city}, {billingAddress.postal_code}
						&nbsp;
						{billingAddress.state_province}
					</div>
					<h4 className='mt-2 font-semibold'>Shipping Information</h4>
					<div>{deliveryAddress.city}</div>
				</div>
			</div>
		</>
	);
};

export default BillingPayment;
