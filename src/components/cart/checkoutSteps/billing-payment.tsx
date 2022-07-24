import React, { useEffect } from 'react';
import useCheckoutSteps from '../../../zustand/checkoutSteps';

const BillingPayment = () => {
	const { backStep, nextStep } = useCheckoutSteps();

	useEffect(() => {
		backStep('/checkout/shipping-delivery');
		nextStep('/checkout/confirmation');
	}, []);

	return <div>billingPayment</div>;
};

export default BillingPayment;
