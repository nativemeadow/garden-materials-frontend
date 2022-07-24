import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import httpFetch from '../../shared/http/http-fetch';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import SimpleButton from '../../shared/components/FormElements/SimpleButton';
import SimpleInput from '../../shared/components/FormElements/SimpleInput';
import {
	VALIDATOR_REQUIRE,
	CONFIRM_PASSWORD,
} from '../../shared/util/validators';
import { formatError } from '../../shared/util/format-error';

import configData from '../../config.json';

import classes from './create-user.module.css';
import { useForm } from '../../shared/hooks/form-hook';

const formInputs = {
	password: { value: '', isValid: false },
	passwordConfirmation: { value: '', isValid: false },
};

const ResetPassword = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [formState, inputHandler] = useForm(formInputs, false);

	const resetPasswordHandler = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();

		console.log('Reset password');
		console.log(formState.inputs);

		const userInfo = {
			password: formState.inputs.password.value,
			passwordConfirmation: formState.inputs.passwordConfirmation.value,
		};

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		};

		try {
			const responseData: any = await httpFetch(
				`${configData.BACKEND_URL}/auth/resetPassword`,
				'PUT',
				JSON.stringify(userInfo),
				headers
			);
			console.log(responseData);
			if (!responseData.message) {
				navigate(`/login/true/${responseData.success}`);
			} else {
				setError(responseData.message);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			{console.log('formState:', formState)}
			<ErrorModal
				error={formatError(error, classes['error__listItems'])}
				onClear={() => setError(null)}
			/>
			<div className={classes['reg-login__container']}>
				<h1 className={classes['reg-login__heading']}>
					Password Reset
				</h1>
				<form name='create-user' onSubmit={resetPasswordHandler}>
					<div className={classes['reg-login-information']}>
						<div className={classes['form-fields-grid']}>
							<div></div>
							<div className={classes['requested-label']}>
								Required
							</div>

							<div className={classes['required']}>*</div>
						</div>
						<SimpleInput
							id='password'
							name='password'
							type='password'
							label={'Password'}
							value={formState.inputs.password.value}
							onInput={inputHandler}
							validators={[VALIDATOR_REQUIRE()]}
							initialIsValid={false}
							errorText='Please enter your password.'
							placeholder='Password'
							parentStyles={classes}
						/>

						<SimpleInput
							id='passwordConfirmation'
							name='passwordConfirmation'
							type='password'
							label={'Confirm Password'}
							value={formState.inputs.passwordConfirmation.value}
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
							parentStyles={classes}
						/>
					</div>
					<SimpleButton
						override={`${classes['reg-login__button']} ${classes.button}`}
						type='submit'
						disabled={!formState.isValid}>
						Continue
					</SimpleButton>
				</form>
			</div>
		</>
	);
};

export default ResetPassword;
