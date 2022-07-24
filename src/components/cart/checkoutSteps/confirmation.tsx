import React, { useEffect } from 'react';
import useCheckoutSteps from '../../../zustand/checkoutSteps';

const Confirmation = () => {
	const { backStep, nextStep } = useCheckoutSteps();

	useEffect(() => {
		backStep('/checkout/billing-payment');
		nextStep('/checkout/orderSummary');
	}, []);

	return <div>confirmation</div>;
};

export default Confirmation;
