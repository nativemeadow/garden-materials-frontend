import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import httpFetch from '../../shared/http/http-fetch';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import SimpleButton from '../../shared/components/FormElements/SimpleButton';
import SimpleInput from '../../shared/components/FormElements/SimpleInput';
import {
	VALIDATOR_REQUIRE,
	CONFIRM_PASSWORD,
} from '../../shared/util/validators';
import { AuthContext } from '../../shared/context/auth-context';

import configData from '../../config.json';

import classes from './create-user.module.css';
import { useForm } from '../../shared/hooks/form-hook';

const formInputs = {
	currentPassword: { value: '', isValid: false },
	newPassword: { value: '', isValid: false },
	passwordConfirmation: { value: '', isValid: false },
};

function ChangePassword() {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [formState, inputHandler] = useForm(formInputs, false);

	useEffect(() => {
		if (!auth.isLoggedIn) {
			navigate('/login');
		}
	}, [auth.isLoggedIn, navigate]);

	const changePasswordHandler = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();

		console.log('Change password');
		console.log(formState.inputs);

		const passwordInfo = {
			currentPassword: formState.inputs.currentPassword.value,
			newPassword: formState.inputs.newPassword.value,
			passwordConfirmation: formState.inputs.passwordConfirmation.value,
		};

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${auth.token}`,
		};

		try {
			const responseData: any = await httpFetch(
				`${configData.BACKEND_URL}/auth/changePassword`,
				'PUT',
				JSON.stringify(passwordInfo),
				headers
			);
			console.log(responseData);
			if (!responseData.message) {
				navigate('/user/success');
			} else {
				setError(responseData.message);
			}
		} catch (error) {
			console.log(error);
		}
	};
	/**
	 *
	 * @param errorList - comma separated list of server side generated errors.
	 * @returns JSX
	 * @todo: enhance the messaging so the server response code displays
	 *        above the error messages.
	 */
	function formatError(errorList: string | null) {
		let errorArray = errorList?.split(',');
		return errorArray?.map((error, key) => {
			return (
				<li key={key} className={classes['error__listItems']}>
					{error}
				</li>
			);
		});
	}

	return (
		<>
			{console.log('formState:', formState)}
			<ErrorModal
				error={formatError(error)}
				onClear={() => setError(null)}
			/>
			<div className={classes['reg-login__container']}>
				<h1 className={classes['reg-login__heading']}>
					Change Password
				</h1>
				<form name='create-user' onSubmit={changePasswordHandler}>
					<div className={classes['reg-login-information']}>
						<div className={classes['form-fields-grid']}>
							<div></div>
							<div className={classes['requested-label']}>
								Required
							</div>

							<div className={classes['required']}>*</div>
						</div>
						<SimpleInput
							id='currentPassword'
							name='currentPassword'
							type='password'
							label={'Current Password'}
							value={formState.inputs.currentPassword.value}
							onInput={inputHandler}
							validators={[VALIDATOR_REQUIRE()]}
							initialIsValid={false}
							errorText='Please enter your current password.'
							parentStyles={classes}
							placeholder='Current Password'
						/>

						<SimpleInput
							id='newPassword'
							name='newPassword'
							type='password'
							label={'New Password'}
							value={formState.inputs.newPassword.value}
							onInput={inputHandler}
							validators={[VALIDATOR_REQUIRE()]}
							initialIsValid={false}
							errorText='Please enter your new password.'
							placeholder='New Password'
							parentStyles={classes}
						/>

						<SimpleInput
							id='passwordConfirmation'
							name='passwordConfirmation'
							type='password'
							label={'Password'}
							value={formState.inputs.passwordConfirmation.value}
							onInput={inputHandler}
							validators={[
								VALIDATOR_REQUIRE(),
								CONFIRM_PASSWORD(
									formState.inputs.newPassword.value
								),
							]}
							initialIsValid={false}
							errorText='Please confirm your password.'
							placeholder='Confirmation Password'
							parentStyles={classes}
						/>
					</div>
					<SimpleButton
						override={`${classes['reg-login__button']} ${classes['button']}`}
						type='submit'
						disabled={!formState.isValid}>
						Change Password
					</SimpleButton>
				</form>
			</div>
		</>
	);
}

export default ChangePassword;
