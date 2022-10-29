export const checkoutNavigation = (isPickup: boolean) => {
	return {
		steps: {
			customerInformation: {
				backStep: '/shopping-cart',
				nextStep: isPickup
					? '/checkout/billing-payment'
					: '/checkout/shipping-delivery',
			},
			shippingDelivery: {
				backStep: '/checkout',
				nextStep: '/checkout/billing-payment',
			},
			billingPayment: {
				backStep: isPickup
					? '/checkout'
					: '/checkout/shipping-delivery',
				nextStep: '/checkout/confirm-order',
			},
			confirmation: {
				backStep: '/checkout/billing-payment',
				nextStep: null,
			},
		},
	};
};
