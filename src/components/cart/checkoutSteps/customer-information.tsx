import React, {
	useEffect,
	useContext,
	useState,
	useRef,
	type RefObject,
} from 'react';
import { IoChevronForward } from 'react-icons/io5';

import { CSSTransition } from 'react-transition-group';

import useCheckoutSteps from '../../../zustand/checkoutSteps';
import LoginForm from '../../../components/users/login-form';
import useManageCart from '../../../shared/hooks/use-manageCart';
import classes from './customer-information.module.css';
import { AuthContext } from '../../../shared/context/auth-context';
import CustomerAddress from './customer-address';
import Registration from '../../users/create-user';

import './customer-information.css';

const LoginUser = (props: { ref?: any }) => {
	const { loadCart } = useManageCart();

	useEffect(() => {
		console.log('existing user');
	}, []);

	return (
		<div className={'customer-info-form-login'}>
			<p className={classes['sub-title']}>
				If you have shopped with us before, please login to place your
				order.
			</p>
			<LoginForm
				loadCart={loadCart}
				navigate={'/shopping-cart'}
				parentStyle={classes}
				flexDirection={'flex flex-col md:flex-row gap-3 justify-start'}
				loginButtonCss={`${classes['login__button']} inline-flex justify-center items-center w-5`}
			/>
		</div>
	);
};

const RegisterNewCustomer = () => {
	const [guestUser, setGuestUser] = useState(false);

	const handleGuestUser = () => {
		console.log('guest user', guestUser);
		setGuestUser(!guestUser);
	};

	return (
		<div className={'customer-info-form-registration'}>
			<div className={'customer-registration-container'}>
				<div className='flex items-center ml-2'>
					<label htmlFor='guest_user'>
						<input
							type='checkbox'
							id='guest_user'
							name='guestUser'
							value='manual'
							onChange={handleGuestUser}
						/>
					</label>
					<span className='font-normal text-base p-2'>
						Continue Without Create An Account
					</span>
				</div>

				<Registration
					heading={false}
					atCheckout={true}
					usernameId={'username'}
					passwordId={'password'}
					guestUser={guestUser}
					containerClass={classes['reg-login__container']}
					credentialsClass={classes['reg-login-information']}
					regErrorWrapperClass={'col-start-1'}
					overrideCSS={classes}
				/>
			</div>
		</div>
	);
};

export default function CustomerInformation() {
	const auth = useContext(AuthContext);
	const { backStep, nextStep } = useCheckoutSteps();

	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const nodeRef = useRef(null);

	useEffect(() => {
		backStep('/shopping-cart');
		nextStep('/checkout/shipping-delivery');
	}, []);

	return (
		<div className={classes['content-wrapper']}>
			{auth.isLoggedIn && <CustomerAddress />}
			{!auth.isLoggedIn && (
				<>
					<div
						ref={nodeRef}
						className='flex'
						onClick={(event: React.MouseEvent<HTMLDivElement>) => {
							setShowLogin(!showLogin);
							setShowRegister(false);
						}}>
						<h3 className='font-bold py-3 cursor-pointer'>
							Existing Customers
						</h3>
						<span className='self-center pl-1 text-2xl text-red-800 cursor-pointer'>
							{showLogin ? (
								<IoChevronForward
									style={{
										transform: 'rotate(90deg)',
										transition: 'all 0.3s ease-in-out',
									}}
								/>
							) : (
								<IoChevronForward
									style={{
										transform: 'rotate(0deg)',
										transition: 'all 0.3s ease-in',
									}}
								/>
							)}
						</span>
					</div>

					<CSSTransition
						in={showLogin}
						timeout={200}
						classNames={'options'}>
						<div className='options'>
							<LoginUser />
						</div>
					</CSSTransition>

					<hr className={classes.divider} />
					<div
						ref={nodeRef}
						className='flex'
						onClick={(event: React.MouseEvent<HTMLDivElement>) => {
							setShowRegister(!showRegister);
							setShowLogin(false);
						}}>
						<h3 className='font-bold py-3 cursor-pointer'>
							New Customers
						</h3>
						<span className='self-center pl-1 text-2xl text-red-800 cursor-pointer'>
							{showRegister ? (
								<IoChevronForward
									style={{
										transform: 'rotate(90deg)',
										transition: 'all 0.3s ease-in-out',
									}}
								/>
							) : (
								<IoChevronForward
									style={{
										transform: 'rotate(0deg)',
										transition: 'all 0.3s ease-in',
									}}
								/>
							)}
						</span>
					</div>

					<CSSTransition
						in={showRegister}
						timeout={200}
						classNames='options'>
						<div className='options'>
							<RegisterNewCustomer />
						</div>
					</CSSTransition>
				</>
			)}
		</div>
	);
}
