import React, { useEffect, useRef, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { AuthContext } from '../../../shared/context/auth-context';
import configData from '../../../config.json';
import { useHttpClient } from '../../../shared/hooks/use-httpClient';
import { useForm } from '../../../shared/hooks/form-hook';
import SimpleInput from '../../../shared/components/FormElements/SimpleInput';
import { VALIDATOR_REQUIRE } from '../../../shared/util/validators';
import { statesProvinces } from '../../../shared/counties-locals/location-lookup';
import useOrders from '../../../zustand/userOrders';

import { User } from '../../../shared/interfaces/user';
import classes from './customer-address.module.css';

import { manualAddress, pickup } from '../../../shared/interfaces/customerInfo';

import { useCheckoutData } from '../checkout';
import { is } from 'immer/dist/internal';

type FormInput = Omit<
	User,
	'username' | 'password' | 'passwordConfirmation' | 'customer_type' | 'type'
>;

type serverResponse = {
	message: string;
	user: FormInput[];
};

const manualDeliveryAddress = {
	name: { value: '', isValid: false },
	address1: { value: '', isValid: false },
	address2: { value: '', isValid: false },
	city: { value: '', isValid: false },
	postal_code: { value: '', isValid: false },
	state_province: { value: '', isValid: false },
	country: { value: '', isValid: false },
};

const ManualAddress = (manualAddress: manualAddress) => {
	const [formState, inputHandler] = useForm(manualDeliveryAddress, false);
	const { setManualAddress } = useOrders();

	useEffect(() => {
		setManualAddress({
			name: formState.inputs.name.value,
			address: `${formState.inputs.address1.value} ${formState.inputs.address2.value}`,
			city: formState.inputs.city.value,
			postal_code: formState.inputs.postal_code.value,
			state_province: formState.inputs.state_province.value,
			country: 'USA',
		});
	}, [formState.inputs, setManualAddress]);

	return (
		<div className={classes['manual-address']}>
			<SimpleInput
				id='name'
				name='name'
				type='text'
				label={'Name'}
				value={formState.inputs.name.value}
				onInput={inputHandler}
				validators={[VALIDATOR_REQUIRE()]}
				parentStyles={classes}
				initialIsValid={false}
				errorText='Please enter name for address.'
				placeholder='Name'
				cssField={classes['deliver-to-name']}
				cssErrorWrapper={'col-start-1'}
			/>

			<div className='md:flex gap-5 w-full'>
				<SimpleInput
					id='address1'
					name='address1'
					type='text'
					label={'Address Line One'}
					value={formState.inputs.address1.value}
					onInput={inputHandler}
					validators={[VALIDATOR_REQUIRE()]}
					parentStyles={classes}
					initialIsValid={false}
					errorText='Please enter address.'
					placeholder='Address Line One'
					cssErrorWrapper={'col-start-1'}
				/>

				<SimpleInput
					id='address2'
					name='address2'
					type='text'
					label={'Address Line Two'}
					value={formState.inputs.address2.value}
					onInput={inputHandler}
					validators={[]}
					initialIsValid={false}
					parentStyles={classes}
					errorText='Please enter address.'
					placeholder='Address Line Two'
					cssErrorWrapper={'col-start-1'}
				/>
			</div>
			<div className='md:flex gap-5 w-full'>
				<SimpleInput
					id='city'
					name='city'
					type='text'
					label={'City'}
					value={formState.inputs.city.value}
					onInput={inputHandler}
					validators={[VALIDATOR_REQUIRE()]}
					initialIsValid={false}
					parentStyles={classes}
					errorText='Please enter city.'
					placeholder='City'
					cssErrorWrapper={'col-start-1'}
				/>

				<div
					className={`${classes['deliver-to-field']} ${classes['deliver-to-state-list']} s:mb-4`}>
					<label
						className={`${classes['deliver-to-field-label']} ${classes['form-field-label']}`}
						htmlFor='state_province'>
						State / Province
					</label>
					<select
						className={`${classes['deliver-to-state-field']} mt-2`}
						id='state_province'
						onChange={inputHandler}
						value={formState.inputs.state_province?.value}
						name='state_province'>
						{statesProvinces[0].states.map((state, index) => {
							return (
								<option key={index} value={state.abbreviation}>
									{state.name}
								</option>
							);
						})}
					</select>
				</div>
				<SimpleInput
					id='postal_code'
					name='postal_code'
					type='text'
					label={'Postal Code'}
					value={formState.inputs.postal_code.value}
					onInput={inputHandler}
					validators={[VALIDATOR_REQUIRE()]}
					initialIsValid={false}
					parentStyles={classes}
					errorText='Please enter postal code.'
					placeholder='Postal Code'
					cssErrorWrapper={'col-start-1'}
				/>
			</div>
		</div>
	);
};

const PickupOption = (pickupOptions: pickup) => {
	const { pickupTime, pickupDate, setPickupDate, setPickupTime } =
		useOrders();

	return (
		<div className='flex flex-col gap-2'>
			<div className={''}>
				<h3 className={'text-base font-bold'}>Store Hours</h3>
			</div>
			<div className={'flex flex-col gap-2'}>
				<div className={'flex flex-col gap-1'}>
					<p className={classes['pickup-option-body-subtitle']}>
						Mon-Fri: 7:00am - 3:00pm
					</p>
					<p>Sat-Sun: Closed</p>
					<p>
						Pickup date/time must be 1 hour later than the current
						time.
					</p>
				</div>
				<div className={'flex flex-col gap-2'}>
					<p className={'text-base font-bold'}>Pickup Date:</p>
					<input
						id='pickup_date'
						type='date'
						name='pickup_date'
						value={pickupDate}
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
							setPickupDate(event.target.value);
						}}
					/>
					<p className={'text-base font-bold'}>Pickup Time:</p>
					<input
						id='pickup_time'
						type='time'
						name='pickup_time'
						value={pickupTime}
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
							setPickupTime(event.target.value);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

function CustomerAddress() {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [formData, setFormData] = useState<FormInput>({} as FormInput);
	const [userAddress, setUserAddress] = useState<FormInput[]>([]);
	const [addressIdx, setAddressIdx] = useState(0);
	const [hasError, setHasError] = useState<string | null>(null);
	let { addressId, manualAddress, pickup } = useCheckoutData();
	const {
		isDelivery,
		isPickup,
		// setIsDelivery,
		// isManualAddress,
		// setIsManualAddress,
		setDeliveryAddressId,
	} = useOrders();

	const customerAction = isDelivery ? 'database' : 'pickup';

	const [pickupState, setPickupState] = useState<string>(customerAction);

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
				const userAddress = serverInfo.user as FormInput[];
				setFormData(userInfo);
				setUserAddress(userAddress);
				setDeliveryAddressId(userAddress[0].address_id);
			} catch (error: any) {
				setHasError(error);
			}
		};

		fetchUser();
	}, []);

	const handleDeliverySelection = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const val = event.target.value;
		console.log('delivery instructions:', val);
		setPickupState(val);
	};

	const handleAddressSelection = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		event.preventDefault();
		const idx = parseInt(event.target.value, 10);
		setAddressIdx(idx);
		addressId = userAddress[idx].address_id;
		setDeliveryAddressId(addressId);
	};

	const customerAddressHandler = () => {};

	return (
		<form onSubmit={customerAddressHandler}>
			<div className={`${classes['logged-in']} gap-6`}>
				<div className='flex flex-col gap-6'>
					<label htmlFor='radio_database'>
						<input
							type='radio'
							id='radio_database'
							onChange={handleDeliverySelection}
							name='address_type'
							value='database'
							checked={pickupState === 'database'}
						/>
						<span className='p-2'>
							Select From Address On File:
						</span>
					</label>
					<select
						className='w-60'
						name='address'
						id='address'
						onChange={handleAddressSelection}>
						{userAddress.map((address, idx) => {
							return (
								<option key={idx} value={idx}>
									{address.address}
								</option>
							);
						})}
					</select>
				</div>
				<div className='fex, flex-direction: column'>
					{(pickupState === 'pickup' || pickupState === 'database') &&
						userAddress.length > 0 && (
							<>
								<div className='font-bold'>
									{userAddress[addressIdx].first_name} &nbsp;
									{userAddress[addressIdx].last_name}
								</div>
								<div>{userAddress[addressIdx].address}</div>
								<div>
									{userAddress[addressIdx].city}{' '}
									{userAddress[addressIdx].state_province}
								</div>
								<div>{userAddress[addressIdx].postal_code}</div>
							</>
						)}
				</div>
				<div className='col-span-2 flex flex-col gap-6 w-full'>
					<label htmlFor='radio_manual'>
						<input
							type='radio'
							id='radio_manual'
							name='address_type'
							value='manual'
							onChange={handleDeliverySelection}
							checked={pickupState === 'manual'}
						/>
						<span className='p-2'>Manually Enter Address:</span>
					</label>
					<CSSTransition
						in={pickupState === 'manual'}
						timeout={200}
						classNames='options'>
						<div className='options'>
							<ManualAddress {...manualAddress} />
						</div>
					</CSSTransition>
				</div>
				<div className='row-start-3 flex flex-col gap-6'>
					<label htmlFor='radio_pickup'>
						<input
							type='radio'
							id='radio_pickup'
							name='address_type'
							value='pickup'
							onChange={handleDeliverySelection}
							checked={pickupState === 'pickup'}
						/>
						<span className='p-2'>Store Pickup :</span>
					</label>
					<CSSTransition
						in={pickupState === 'pickup'}
						appear={isPickup}
						timeout={200}
						classNames='options'>
						<div className='options'>
							<PickupOption {...pickup} />
						</div>
					</CSSTransition>
				</div>
			</div>
		</form>
	);
}

export default CustomerAddress;
