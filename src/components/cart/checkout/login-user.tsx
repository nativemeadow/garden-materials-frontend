import React, { useEffect } from 'react';
import LoginForm from '../../users/login-form';
import useManageCart from '../../../shared/hooks/use-manageCart';
import classes from './customer-information.module.css';

export const LoginUser = (props: { ref?: any }) => {
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
