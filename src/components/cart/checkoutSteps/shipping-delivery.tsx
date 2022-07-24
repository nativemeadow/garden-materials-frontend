import React, { useEffect } from 'react';
import useCheckoutSteps from '../../../zustand/checkoutSteps';

const ShippingDelivery = () => {
	const { backStep, nextStep } = useCheckoutSteps();

	useEffect(() => {
		backStep('/checkout');
		nextStep('/checkout/billing-payment');
	}, []);

	return <div>shippingDelivery</div>;
};
export default ShippingDelivery;
