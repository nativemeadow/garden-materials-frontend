import React, { useEffect, useReducer } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useCheckoutSteps from '../../zustand/checkoutSteps';

import classes from './checkout.module.css';

export default function OrderSummary() {
	return (
		<div className='page_default'>
			<h1>Your Order Summary</h1>
		</div>
	);
}
