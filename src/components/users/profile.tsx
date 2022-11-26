import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import httpFetch from '../../shared/http/http-fetch';
import configData from '../../config.json';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal';
import { User } from '../../shared/interfaces/user';
import ProfileInformation from './profile-information';
import { useForm, formStateIf } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/use-httpClient';
import SimpleButton from '../../shared/components/FormElements/SimpleButton';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { formInputs } from './initial-formInput';
import { formatError } from '../../shared/util/format-error';

import classes from './create-user.module.css';

type FormInput = Omit<
	User,
	'username' | 'password' | 'passwordConfirmation' | 'customer_type' | 'type'
>;

type serverResponse = {
	message: string;
	user: FormInput[];
};

const parseInputs = (inputs: any) => {
	const newInputs: formStateIf = {};
	for (const inputId in inputs) {
		if (!inputs[inputId]) {
			continue;
		}
		if (
			inputId === 'updatedAt' ||
			inputId === 'createdAt' ||
			inputId === 'refreshToken' ||
			inputId === 'id' ||
			inputId === 'password'
		) {
			continue;
		}
		newInputs[inputId] = {
			value: inputs[inputId],
			isValid: true,
		};
	}
	return newInputs;
};

export default function Profile() {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();
	const [hasError, setHasError] = useState<string | null>(null);
	const [formState, inputHandler, setFormData] = useForm(formInputs, false);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
	const [successMessage, setSuccessMessage] = useState<string>('');

	const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const val = event.target.value;
		const name = event.target.name;
		inputHandler(name, val, true);
	};

	useEffect(() => {
		if (!auth.isLoggedIn) {
			navigate('/login');
		}
	}, [auth.isLoggedIn, navigate]);

	useEffect(() => {
		console.log('useEffect - getUser');

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${auth.token}`,
		};

		const fetchUser = async () => {
			try {
				const serverInfo = await sendRequest<serverResponse>(
					`${configData.BACKEND_URL}/auth/getUser`,
					undefined,
					null,
					headers
				);
				const userInfo = serverInfo.user[0] as FormInput;
				setFormData(parseInputs(userInfo), true);
			} catch (error: any) {
				setHasError(error);
			}
		};

		fetchUser();
	}, [auth.token, sendRequest, setFormData]);

	const updateUserHandler = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		console.log('Update User');
		console.log(formState.inputs);

		const parseOutput = () => {
			const newInputs: { [key: string]: string | number } = {};
			for (const inputId in formState.inputs) {
				if (!formState.inputs[inputId]) {
					continue;
				}
				newInputs[inputId] = formState.inputs[inputId].value;
			}
			return newInputs;
		};
		const updateUserInfo = parseOutput();

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${auth.token}`,
		};
		try {
			// @FIXME: use sendRequest instead of httpFetch
			const responseData: any = await httpFetch(
				`${configData.BACKEND_URL}/auth/updateProfile`,
				'PUT',
				JSON.stringify(updateUserInfo),
				headers
			);
			console.log('response to update:', responseData);
			if (responseData.success) {
				setSuccessMessage(responseData.success);
				setShowSuccessModal(true);
				auth.updateUserSession(
					formState.inputs.first_name.value,
					formState.inputs.last_name.value,
					formState.inputs.email.value,
					formState.inputs.phone.value
				);
				navigate('/user/profile');
			} else {
				setHasError(responseData.message);
			}
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoading) {
		return (
			<div className='center'>
				<LoadingSpinner asOverlay />
			</div>
		);
	}

	const closeSuccessModal = () => {
		setShowSuccessModal(false);
	};

	return (
		<>
			{auth.isLoggedIn && (
				<>
					{/* {hasError && <div className='error'>{error}</div>} */}
					{/* <ErrorModal
						error={formatError(error, classes['error__listItems'])}
						onClear={() => clearError()}
					/> */}
					<Modal
						show={showSuccessModal}
						header={'Success'}
						headerClass='bg-white text-success'
						onCancel={closeSuccessModal}>
						{successMessage}
					</Modal>
					<div className={classes['reg-login__container']}>
						<h1 className={classes['reg-login__heading']}>
							Update Your Account
						</h1>
						<form name='create-user' onSubmit={updateUserHandler}>
							<ProfileInformation
								inputVal={formState}
								initialIsValid={true}
								onInput={inputHandler}
								changeHandler={changeHandler}
								parentStyles={classes}
							/>
							<SimpleButton
								override={`${classes['reg-login__button']} ${classes['button']}`}
								type='submit'
								disabled={!formState.isValid}>
								Save
							</SimpleButton>
						</form>
					</div>
				</>
			)}
		</>
	);
}
