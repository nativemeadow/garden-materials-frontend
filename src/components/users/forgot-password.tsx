import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import httpFetch from '../../shared/http/http-fetch';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import SimpleButton from '../../shared/components/FormElements/SimpleButton';
import SimpleInput from '../../shared/components/FormElements/SimpleInput';
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_EMAIL,
} from '../../shared/util/validators';
import { formatError } from '../../shared/util/format-error';

import configData from '../../config.json';

import classes from './create-user.module.css';
import { useForm } from '../../shared/hooks/form-hook';

const formInputs = {
	email: { value: '', isValid: false },
};

export const ForgotPassword = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [formState, inputHandler] = useForm(formInputs, false);

	const forgotPasswordHandler = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();

		console.log('Change password');
		console.log(formState.inputs);

		const forgotPasswordInfo = {
			email: formState.inputs.email.value,
		};

		const headers = {
			'Content-Type': 'application/json',
		};

		try {
			const responseData: any = await httpFetch(
				`${configData.BACKEND_URL}/auth/forgotPassword`,
				'PUT',
				JSON.stringify(forgotPasswordInfo),
				headers
			);
			console.log(responseData);
			if (!responseData.message) {
				navigate(`/user/success/${responseData.success}`);
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
					Forgot Password
				</h1>
				<form name='create-user' onSubmit={forgotPasswordHandler}>
					<SimpleInput
						id='email'
						name='email'
						type='email'
						label={'Your Email'}
						value={formState.inputs.email.value}
						onInput={inputHandler}
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
						initialIsValid={false}
						errorText='Please enter your email address.'
						placeholder='Your email address'
						parentStyles={classes}
					/>
					<SimpleButton
						override={`${classes['reg-login__button']} ${classes['button']}`}
						type='submit'
						disabled={!formState.isValid}>
						Submit
					</SimpleButton>
				</form>
			</div>
		</>
	);
};
