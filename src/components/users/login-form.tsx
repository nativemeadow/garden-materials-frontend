import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { formatError } from '../../shared/util/format-error';
import { Items } from '../../shared/interfaces/items';

import SimpleButton from '../../shared/components/FormElements/SimpleButton';
import SimpleInput from '../../shared/components/FormElements/SimpleInput';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import useManageOrders from '../../shared/hooks/use-manageOrders';
import { useManageUsers } from '../../shared/hooks/use-manageUsers';

import classes from './login-form.module.css';

const customerLogin = {
	username: { value: '', isValid: false },
	password: { value: '', isValid: false },
};

type Props = {
	loadCart?: (token: boolean | null, itemsList?: Items[]) => void;
	navigate?: string;
	flexDirection?: string;
	loginButtonCss?: string;
	positionRestPassword?: string;
	parentStyle?: { readonly [key: string]: string };
};

export default function LoginForm(props: Props) {
	const auth = useContext(AuthContext);
	const [formState, inputHandler] = useForm(customerLogin, false);
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const { setOrderDetails } = useManageOrders();
	const { userHandler } = useManageUsers();

	const styles = { ...classes, ...props.parentStyle };

	const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(formState.inputs);

		try {
			const responseData: any = await userHandler(
				formState,
				'/auth/login'
			);
			console.log('response on login: ', responseData);
			if (!responseData.message) {
				auth.login(
					responseData.userId,
					responseData.username,
					responseData.email,
					responseData.firstName,
					responseData.lastName,
					responseData.phone,
					responseData.token
				);
				props.loadCart?.(responseData.token, responseData.cart);
				if (responseData.orders) {
					setOrderDetails(responseData.orders);
				}
				props.navigate && navigate(props.navigate);
			} else {
				setError(responseData.message);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const resetPassword = () => {
		return (
			<>
				<h4>Forgot your password</h4>
				[+]&nbsp;
				<Link
					className={classes['create-account__link']}
					to='/user/forgot-password'>
					Click here to reset you password.
				</Link>
			</>
		);
	};

	return (
		<>
			{console.log('login form')}
			<ErrorModal
				error={formatError(error, classes['error__listItems'])}
				onClear={() => setError(null)}
			/>
			<div className={classes['content-wrapper']}>
				<h2 className='text-3xl mb-4'>Login</h2>
				<div className={classes['login']}>
					<form onSubmit={submitLogin}>
						<div className={classes['login-wrapper']}>
							<div className={props.flexDirection}>
								<SimpleInput
									id='username'
									name='username'
									type='text'
									label={'Username:'}
									value={formState.inputs.username.value}
									onInput={inputHandler}
									validators={[VALIDATOR_REQUIRE()]}
									initialIsValid={false}
									errorText='Please enter your user name.'
									placeholder='Username'
									parentStyles={styles}
									cssErrorWrapper={'col-start-1'}
									cssField={classes['login__username']}
								/>
								<SimpleInput
									id='password'
									name='password'
									type='password'
									label={'Password:'}
									value={formState.inputs.password.value}
									onInput={inputHandler}
									validators={[VALIDATOR_REQUIRE()]}
									initialIsValid={false}
									errorText='Please enter your user password.'
									placeholder='Password'
									parentStyles={styles}
									cssErrorWrapper={'col-start-1'}
									cssField={classes['login__password']}
								/>
							</div>
							<div
								className={`${props.flexDirection} gap-4 my-4`}>
								<SimpleButton
									override={`${props.loginButtonCss} `}
									type='submit'
									disabled={!formState.isValid}>
									Login
								</SimpleButton>
								<span>{resetPassword()}</span>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
