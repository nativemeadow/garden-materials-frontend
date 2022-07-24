import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Items } from '../../shared/interfaces/items';
// import Image from '../../shared/components/UIElements/Images';
import useManageCart from '../../shared/hooks/use-manageCart';
import useManageOrders from '../../shared/hooks/use-manageOrders';
import { AuthContext } from '../../shared/context/auth-context';
import useShoppingCart from '../../zustand/shoppingCart';
import useOrders from '../../zustand/userOrders';
import httpFetch from '../../shared/http/http-fetch';

import configData from '../../config.json';
import classes from './shopping-cart.module.css';

import ShoppingCartItems from './shopping-cart-items';
import PickupOption from './pickup-option';
import DeliveryOption from './delivery-option';
import { formatDate } from '../../shared/util/date-utils';
import CalCost from './calculate-cost';
import './shopping-cart.css';

const ShoppingCart = () => {
	const [pickupState, setPickupState] = useState('');
	const { remove, update } = useManageCart();
	const { setOrderDetails, updateOrderDetail } = useManageOrders();

	const auth = useContext(AuthContext);
	const { loadCart, updateItem, removeItem } = useShoppingCart();
	const shoppingCart = useShoppingCart((state) => state);
	const userOrders = useOrders((state) => state);
	const navigate = useNavigate();
	const { setIsPickup, setIsDelivery, pickupDate, pickupTime } = useOrders();
	const { dollarUSLocale } = CalCost();

	console.log(
		'shopping cart : Pickup Date: ',
		pickupDate,
		'Pickup Time: ',
		pickupTime
	);

	useEffect(() => {
		const cart = localStorage.getItem('order');
		if (!auth.isLoggedIn && cart) {
			loadCart(JSON.parse(cart) as Items[]);
			return;
		}

		function checkForCartItems(): void {
			const cart = localStorage.getItem('order');
			if (cart) {
				loadCart(JSON.parse(cart) as Items[]);
			} else {
				loadCart([]);
			}
		}

		checkForCartItems();
	}, []);

	const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const itemId = parseInt(event.currentTarget.dataset['itemId']!, 10);
		const newQty = event.target.value;

		console.log('Update this cart item', itemId, ' Quantity to', newQty);

		const newCart = async (newQty: string) => {
			const newQuantity = parseFloat(newQty);
			await update(itemId, newQuantity);
			updateItem(itemId, newQuantity);
		};
		newCart(newQty);
	};

	const removeHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const itemId = parseInt(event.currentTarget.dataset['itemId']!, 10);
		console.log('Remove this cart item', itemId);

		const newCart = async () => {
			const newCart = await remove(itemId);
			if (newCart) {
				removeItem(itemId);
			}
		};
		newCart();
	};

	const checkoutOptionHandler = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		console.log('delivery instructions:', event.target.value);
		setPickupState(event.target.value);
		setIsPickup(event.target.value === 'pickup');
		setIsDelivery(event.target.value === 'delivery');
	};

	const checkoutHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log('Shopping cart checkout button clicked');
		const order = {
			userId: auth.userId,
			delivery_instructions: userOrders.deliveryInstructions,
			purchase_order: userOrders.purchaseOrder,
			is_pickup: userOrders.isPickup ? 1 : 0, // 1 = true, 0 = false
			is_delivery: userOrders.isDelivery ? 1 : 0, // 1 = true, 0 = false
			requested_delivery_date: formatDate(
				userOrders.requestedDeliveryDate
			),
			isPickup: userOrders.isPickup,
			isDelivery: userOrders.isDelivery,
			items: shoppingCart.Items,
			pickup_date: formatDate(userOrders.pickupDate),
			pickup_time: userOrders.pickupTime,
			manual_address: userOrders.manualAddress,
		};

		setOrderDetails({
			...order,
			order_date: userOrders.orderDate,
		});

		if (!auth.isLoggedIn) {
			navigate('/checkout');
			return;
		}

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${auth.token}`,
		};

		try {
			const response = await httpFetch(
				`${configData.BACKEND_URL}/orders/createOrder`,
				'POST',
				JSON.stringify(order),
				headers
			);

			console.log('Order response', response);
			navigate('/orders');
		} catch (error) {
			console.log('Error', error);
		}

		navigate('/checkout');
	};

	const setTheStep = (unit: string | undefined): string => {
		const unitsArray = ['lbs', 'ton', 'tons', 'yds', 'yds', 'ft', 'cu ft'];
		if (!unit) {
			return '';
		}
		return unitsArray.includes(unit) ? '0.5' : '1';
	};

	const onPurchaseOrderBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		const purchaseOrder = event.target.value;
		updateOrderDetail(event.target.name, purchaseOrder);
	};

	return (
		<>
			<div id={classes['shopping-cart']}>
				<h3>Shopping Cart</h3>
				<div className={classes['shopping-cart']}>
					<div className={classes['shopping-cart__grid']}>
						<form name='checkout' onSubmit={checkoutHandler}>
							<ShoppingCartItems
								items={shoppingCart.Items}
								setTheStep={setTheStep}
								onQuantityChange={onQuantityChange}
								removeHandler={removeHandler}
							/>
							<section
								className={
									classes['shopping-cart__checkout--section']
								}>
								<div
									className={
										classes[
											'shopping-cart__checkout--options'
										]
									}>
									<h4
										className={
											classes[
												'shopping-cart__checkout--options-title'
											]
										}>
										Checkout Option
									</h4>
									<span
										className={
											classes[
												'shopping-cart__checkout--options-alert'
											]
										}>
										Choose checkout option Pickup from store
										or delivery
									</span>
								</div>
								<div>
									<div
										className={
											classes[
												'shopping-cart__checkout-options--radio'
											]
										}>
										<label>
											<input
												className='align-middle'
												onChange={checkoutOptionHandler}
												id='CX-Pickup'
												name='cxtype'
												type='radio'
												value='pickup'
											/>
											<span className={'pl-2'}>
												In-Store Pickup
											</span>
										</label>
									</div>
									<div
										className={
											classes[
												'shopping-cart__checkout-options--radio'
											]
										}>
										<label>
											<input
												onChange={checkoutOptionHandler}
												id='CX-Delivery'
												name='cxtype'
												type='radio'
												value='delivery'
											/>
											<span className={'pl-2'}>
												Delivery
											</span>
										</label>
									</div>
									<div
										className={
											classes[
												'shopping-cart__checkout-options--po-option'
											]
										}>
										<label>PO# (Optional) </label>
										<input
											className={`
												${classes['shopping-cart__checkout-options--po-option--text']} ${classes['purchase_order']}
												]}
											`}
											name='purchase_order'
											type='text'
											size={10}
											value={userOrders.purchaseOrder}
											onChange={(
												event: React.ChangeEvent<HTMLInputElement>
											) => {
												userOrders.setPurchaseOrder(
													event.target.value
												);
											}}
											onBlur={onPurchaseOrderBlur}
										/>
									</div>
								</div>
								{/* 
								<div
									className={
										pickupState === 'pickup'
											? 'options options-enter'
											: 'options'
									}>
									<PickupOption />
								</div>

								<div
									className={
										pickupState === 'delivery'
											? 'options options-enter'
											: 'options'
									}>
									<DeliveryOption />
								</div> */}

								<div className='options-wrapper'>
									<CSSTransition
										in={pickupState === 'pickup'}
										timeout={{
											appear: 900,
											enter: 300,
											exit: 500,
										}}
										classNames={'options'}>
										<PickupOption />
									</CSSTransition>

									<CSSTransition
										in={pickupState === 'delivery'}
										timeout={{
											appear: 900,
											enter: 300,
											exit: 500,
										}}
										classNames={'options'}>
										<DeliveryOption />
									</CSSTransition>
								</div>
							</section>
						</form>
					</div>
					<div className={classes['order-subtotal']}>
						<h3>SubTotal</h3>
						<p>
							${dollarUSLocale.format(shoppingCart.cartTotal())}
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default ShoppingCart;
