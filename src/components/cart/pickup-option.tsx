import React from 'react';
import useShoppingCart from '../../zustand/shoppingCart';

import classes from './shopping-cart.module.css';
import './shopping-cart.css';

export default function PickupOption() {
	const shoppingCart = useShoppingCart((state) => state);
	return (
		<div className={'options'}>
			<div className={classes['checkout__pickup-group']}>
				<h4 className={classes['checkout__delivery-group-title']}>
					In Store Pickup
				</h4>
				<span className={classes['checkout__pickup-alert']}>
					Your order will be available at our location for pickup.
				</span>
			</div>
			<div className={classes['checkout__pickup-container']}>
				<p className={classes['checkout__pickup-notice-all']}>
					In Store Pickup Orders Will Have A 1-Hour Lead Time For
					Processing
				</p>
				<div className={classes['checkout__button--container']}>
					<button
						type='submit'
						className={classes['checkout__button']}
						disabled={shoppingCart.cartIsEmpty()}>
						Check Out
					</button>
				</div>
			</div>
		</div>
	);
}
