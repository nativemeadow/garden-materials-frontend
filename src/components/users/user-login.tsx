import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { formatError } from '../../shared/util/format-error';
import useManageCart from '../../shared/hooks/use-manageCart';
import LoginForm from './login-form';

import classes from './user-login.module.css';

export default function UserLogin() {
	let { login, message } = useParams();
	const [messageText, setMessageText] = useState('Success');
	const navigate = useNavigate();

	const { loadCart } = useManageCart();

	useEffect(() => {
		if (login && message?.length! > 0) {
			setMessageText(message!);
		}
	}, [login, navigate, message]);

	return (
		<div className={classes['login__container']}>
			<div className={classes['login__grid']}>
				<div className={classes['login__form']}>
					<LoginForm
						loadCart={loadCart}
						navigate={'/welcome'}
						flexDirection={'flex flex-col w-full'}
						loginButtonCss={`${classes['login__button']} inline-flex justify-center items-center w-full`}
					/>
				</div>
				<div className={classes['login__new-account']}>
					{login ? (
						<>
							{messageText ? (
								<h2>{messageText}</h2>
							) : (
								<h2>Your Account has been created</h2>
							)}
							<p>Please login</p>
						</>
					) : (
						<>
							<h2>New Account Sign Up</h2>
							<p>
								If you do not have an online account, you can
								create one here.
							</p>
							<Link
								className={classes['create-account__button']}
								to='/user/create-account'>
								Sign Up
							</Link>
							<h4>Accounts Receivable?</h4>
							[+]&nbsp;
							<Link
								className={classes['create-account__link']}
								to='/user/create-account'>
								If you already have a credit account with us,
								sign up to access your existing Accounts
								Receivable account on-line
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
