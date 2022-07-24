import React, {
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
	type RefObject,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import ProfileInformation from './profile-information';
import SimpleButton from '../../shared/components/FormElements/SimpleButton';
import SimpleInput from '../../shared/components/FormElements/SimpleInput';
import {
	VALIDATOR_REQUIRE,
	CONFIRM_PASSWORD,
} from '../../shared/util/validators';
import { formatError } from '../../shared/util/format-error';
import { useManageUsers } from '../../shared/hooks/use-manageUsers';
import useManageOrders from '../../shared/hooks/use-manageOrders';

import { Items } from '../../shared/interfaces/items';
import { useForm } from '../../shared/hooks/form-hook';
import { formInputs } from './initial-formInput';

import classes from './create-user.module.css';
import './create-user.css';

// const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

interface Props {
	heading?: boolean;
	usernameId?: string;
	passwordId?: string;
	atCheckout?: boolean;
	guestUser?: boolean;
	submitText?: string;
	nextNav?: string;
	loadCart?: (token: boolean | null, itemsList?: Items[]) => void;
	overrideCSS?: { readonly [key: string]: string };
	containerClass?: string;
	credentialsClass?: string;
	fieldClass?: string;
	regErrorWrapperClass?: string;
}

const CreateUser = forwardRef(
	(
		{
			heading = true,
			usernameId = 'username',
			passwordId = 'password',
			atCheckout = false,
			guestUser = false,
			submitText,
			nextNav,
			loadCart,
			overrideCSS,
			containerClass,
			credentialsClass,
			fieldClass,
			regErrorWrapperClass,
		}: Props,
		ref?: any
	) => {
		const navigate = useNavigate();
		const [error, setError] = useState<string | null>(null);
		const [showCredentials, setShowCredentials] = useState<boolean>(true);
		const [formState, inputHandler] = useForm(formInputs, false);
		const regFieldCSS = fieldClass ? fieldClass : '';
		const regErrorWrapperCSS = regErrorWrapperClass
			? regErrorWrapperClass
			: 'col-start-2';
		const { userHandler } = useManageUsers();
		const { setOrderDetails } = useManageOrders();

		useEffect(() => {
			if (atCheckout && guestUser) {
				setShowCredentials(false);
			} else {
				setShowCredentials(true);
			}
		}, [atCheckout, guestUser]);

		const styles = overrideCSS ? { ...classes, ...overrideCSS } : classes;

		const changeHandler = (
			event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>
		) => {
			const val = event.target.value;
			const name = event.target.name;
			inputHandler(name, val, true);
		};

		const submitHandler = async (event: React.FormEvent) => {
			event.preventDefault();
			createUserHandler();
		};

		const createUserHandler = async () => {
			console.log('Create User');

			let path = '/auth/signup';
			if (atCheckout && !showCredentials) {
				path = '/auth/guestUser/createGuestUser';
				guestUser = true;
			}

			try {
				const responseData: any = await userHandler(formState, path);
				console.log(responseData);
				if (!responseData.message) {
					if (guestUser) {
						loadCart?.(responseData.token, responseData.cart);
						if (responseData.orders) {
							setOrderDetails(responseData.orders);
						}
						navigate('/checkout');
					} else {
						navigate(`/login/true/${responseData.success}`);
					}
				} else {
					setError(responseData.message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		useImperativeHandle(ref, () => ({
			submit: () => {
				createUserHandler();
			},
		}));

		return (
			<>
				{console.log('formState:', formState)}
				<ErrorModal
					error={formatError(error, classes.error__listItems)}
					onClear={() => setError(null)}
				/>
				<div
					className={
						containerClass
							? containerClass
							: classes['reg-login__container']
					}>
					{heading && (
						<h1 className={classes['reg-login__heading']}>
							Create Your Account
						</h1>
					)}

					{!atCheckout && (
						<h2
							className={
								heading
									? `${classes['reg-login__company-heading']}`
									: `text-3xl mb-4`
							}>
							{showCredentials && <span>Login Information</span>}
						</h2>
					)}
					<form name='create-user' onSubmit={submitHandler}>
						{!atCheckout && (
							<div className={classes['form-fields-grid']}>
								<div></div>
								<div className={classes['requested-label']}>
									Required
								</div>
								<div className={classes['required']}>*</div>
							</div>
						)}
						<CSSTransition
							in={showCredentials}
							appear={true}
							timeout={200}
							classNames={'options'}>
							<div className='options'>
								{atCheckout && <h2>Login Information</h2>}
								<div
									className={
										credentialsClass
											? credentialsClass
											: classes['reg-login-information']
									}>
									<SimpleInput
										id={usernameId}
										name='username'
										type='text'
										label={'Username'}
										value={formState.inputs.username.value}
										onInput={inputHandler}
										validators={[VALIDATOR_REQUIRE()]}
										initialIsValid={false}
										errorText='Please enter your user name.'
										placeholder='Username'
										parentStyles={styles}
										cssField={regFieldCSS}
										cssErrorWrapper={regErrorWrapperCSS}
									/>

									<SimpleInput
										id={passwordId}
										name='password'
										type='password'
										label={'Password'}
										value={formState.inputs.password.value}
										onInput={inputHandler}
										validators={[VALIDATOR_REQUIRE()]}
										initialIsValid={false}
										errorText='Please enter your password.'
										parentStyles={styles}
										placeholder='Password'
										cssField={regFieldCSS}
										cssErrorWrapper={regErrorWrapperCSS}
									/>

									<SimpleInput
										id='passwordConfirmation'
										name='passwordConfirmation'
										type='password'
										label={'Password Confirmation'}
										value={
											formState.inputs
												.passwordConfirmation.value
										}
										onInput={inputHandler}
										validators={[
											VALIDATOR_REQUIRE(),
											CONFIRM_PASSWORD(
												formState.inputs.password.value
											),
										]}
										initialIsValid={false}
										errorText='Please confirm your password.'
										placeholder='Confirmation Password'
										parentStyles={styles}
										cssField={regFieldCSS}
										cssErrorWrapper={regErrorWrapperCSS}
									/>
								</div>
							</div>
						</CSSTransition>
						<ProfileInformation
							inputVal={formState}
							initialIsValid={false}
							onInput={inputHandler}
							changeHandler={changeHandler}
							parentStyles={styles}
							cssField={fieldClass}
							cssErrorWrapper={regErrorWrapperClass}>
							<h2
								className={
									classes['reg-login__name-address-heading']
								}>
								Name &amp; Address
							</h2>
						</ProfileInformation>
						<SimpleButton
							override={`${classes['reg-login__button']} ${classes.button}`}
							type='submit'
							disabled={!formState.isValid}>
							{atCheckout
								? showCredentials
									? 'Create Your Account'
									: 'Continue as Guest'
								: 'Continue'}
						</SimpleButton>
					</form>
				</div>
			</>
		);
	}
);

export default CreateUser;
