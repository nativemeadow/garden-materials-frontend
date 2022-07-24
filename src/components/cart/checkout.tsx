import React, {
	useState,
	useEffect,
	useReducer,
	useContext,
	useRef,
} from 'react';
import {
	Outlet,
	useOutletContext,
	useLocation,
	useNavigate,
} from 'react-router-dom';
import useCheckoutSteps from '../../zustand/checkoutSteps';
import {
	manualAddress,
	pickup,
	addressContextType,
	initialAddressInfo,
} from '../../shared/interfaces/customerInfo';

import classes from './checkout.module.css';

type checkoutSteps = { step: string; path: string };
type checkoutAction = { type: string; payload: string };
const initialState = { step: 'shopping-cart', path: '/shopping-cart' };

function reducer(state: checkoutSteps, action: checkoutAction) {
	switch (action.type) {
		case '/checkout':
			return { ...state, step: 'customer-info' };
		case '/checkout/shipping-delivery':
			return { ...state, step: 'shipping-delivery' };
		case '/checkout/billing-payment':
			return { ...state, step: 'billing-payment' };
		case '/checkout/confirmation':
			return { ...state, step: 'confirmation' };
		default:
			return state;
	}
}

export function useCheckoutData() {
	return useOutletContext<addressContextType>();
}

const Checkout = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { back, next, backStep, nextStep } = useCheckoutSteps();
	const [state, dispatch] = useReducer(reducer, initialState);
	const [addressInfo, setAddressInfo] =
		useState<addressContextType>(initialAddressInfo);
	// const saveNewCustomerRef = useRef(null);

	useEffect(() => {
		backStep('/shopping-cart');
		nextStep('/checkout/shipping-delivery');
	}, []);

	useEffect(() => {
		dispatch({ type: location.pathname, payload: location.pathname });
	}, [location]);

	const onBack = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		navigate(back);
	};

	const onNext = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		console.log(getStep());

		navigate(next);
	};

	function getStep() {
		switch (state.step) {
			case 'customer-info': {
				return state.step;
			}
			case 'shipping-delivery': {
				return state.step;
			}
			case 'billing-payment': {
				return state.step;
			}
			case 'confirmation': {
				return state.step;
			}
			default:
				return 'no step found';
		}
	}

	return (
		<section className='page_default'>
			<div className={classes.checkout}>
				<div
					className={`${classes.checkout_step} ${
						state.step === 'customer-info' && classes['active_step']
					}`}>
					<div className={classes['checkout_number']}>
						<span className={classes['num']}>1</span>
					</div>
					<div className={classes.checkout_text}>Customer Info</div>
				</div>
				<div
					className={`${classes['checkout_step']} ${
						state.step === 'shipping-delivery' &&
						classes['active_step']
					}`}>
					<div className={classes['checkout_number']}>
						<span className={classes['num']}>2</span>
					</div>
					<div className={classes['checkout_text']}>
						Shipping & Delivery
					</div>
				</div>
				<div
					className={`${classes['checkout_step']} ${
						state.step === 'billing-payment' &&
						classes['active_step']
					}`}>
					<div className={classes['checkout_step']}>
						<div className={classes['checkout_number']}>
							<span className={classes['num']}>3</span>
						</div>
						<div className={classes['checkout_text']}>
							Billing & Payment
						</div>
					</div>
				</div>
				<div
					className={`${classes.checkout_step} ${
						state.step === 'confirmation' && classes.active_step
					}`}>
					<div className={classes.checkout_step}>
						<div className={classes.checkout_number}>
							<span className={classes.num}>4</span>
						</div>
						<div className={classes.checkout_text}>Confirm</div>
					</div>
				</div>
			</div>
			<p className={classes.message}></p>
			<div className={`${classes['checkout_form']} w-10/12 m-auto`}>
				<Outlet context={{ addressInfo }} />
			</div>
			<div className={classes.buttons}>
				<button
					className={`${classes.back} inline-flex justify-center items-center`}
					onClick={onBack}>
					Back
				</button>
				<button
					className={`${classes.next} inline-flex justify-center items-center`}
					onClick={onNext}>
					Continue
				</button>
			</div>
		</section>
	);
};

export default Checkout;
