import React, { useState, useEffect, useReducer, useContext } from 'react';
import {
	Outlet,
	useOutletContext,
	useLocation,
	useNavigate,
} from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { formatError } from '../../shared/util/format-error';
import { AuthContext } from '../../shared/context/auth-context';
import useCheckoutSteps from '../../zustand/checkoutSteps';
import {
	addressContextType,
	initialAddressInfo,
} from '../../shared/interfaces/customerInfo';
import useManageOrders from '../../shared/hooks/use-manageOrders';
import useOrders from '../../zustand/userOrders';

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
	const auth = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();

	const [state, dispatch] = useReducer(reducer, initialState);
	// const { isPickup, isDelivery } = useOrders();
	const [addressInfo, setAddressInfo] =
		useState<addressContextType>(initialAddressInfo);
	// const saveNewCustomerRef = useRef(null);
	const { updateCustomerOrder } = useManageOrders();
	const [error, setError] = useState<string | null>(null);
	const { isPickup, isDelivery } = useOrders();
	//const checkoutNav = checkoutNavigation(isPickup);
	const {
		back,
		next,
		backStep,
		nextStep,
		setPickup,
		setCurrentStep,
		currentNavigation,
	} = useCheckoutSteps();

	useEffect(() => {
		setPickup(isPickup);
		setCurrentStep(state.step);
		const { backNav, nextNav } = currentNavigation();
		backStep(backNav);
		nextStep(nextNav);
	}, [
		backStep,
		currentNavigation,
		isPickup,
		nextStep,
		setCurrentStep,
		setPickup,
		state.step,
	]);

	useEffect(() => {
		dispatch({ type: location.pathname, payload: location.pathname });
	}, [location]);

	const onBack = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		navigate(back);
	};

	const onNext = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const step = getStep();
		let data = null;
		let isError = false;

		if (step === 'customer-info') {
			data = await updateDatabase();
			if (data?.message.includes('Error')) {
				setError(data.message);
				isError = true;
			}
		}

		if (!isError && next) {
			navigate(next);
		}
	};

	const updateDatabase = async () => {
		try {
			return await updateCustomerOrder();
		} catch (err: any) {
			setError(err);
		}
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
			<ErrorModal
				error={formatError(error, classes.error__listItems)}
				onClear={() => setError(null)}
			/>
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
					onClick={onNext}
					disabled={!auth.isLoggedIn}>
					Continue
				</button>
			</div>
		</section>
	);
};

export default Checkout;
