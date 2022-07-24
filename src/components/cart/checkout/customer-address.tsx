import React, { useEffect, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { AuthContext } from '../../../shared/context/auth-context';
import configData from '../../../config.json';
import { useHttpClient } from '../../../shared/hooks/use-httpClient';
import useOrders from '../../../zustand/userOrders';
import useCheckoutSteps from '../../../zustand/checkoutSteps';

import { User } from '../../../shared/interfaces/user';
import classes from './customer-address.module.css';

// import { useCheckoutData } from '../checkout';
import { ManualAddress } from './manual-address';
import { PickupOption } from './pickup-option';

type FormInput = Omit<
	User,
	'username' | 'password' | 'passwordConfirmation' | 'customer_type' | 'type'
>;

type serverResponse = {
	message: string;
	user: FormInput[];
};

function CustomerAddress() {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [hasError, setHasError] = useState<string | null>(null);
	const [formData, setFormData] = useState<FormInput>({} as FormInput);
	const [userAddress, setUserAddress] = useState<FormInput[]>([]);
	const [addressIdx, setAddressIdx] = useState(0);

	const {
		isDelivery,
		isPickup,
		isManualAddress,
		setIsManualAddress,
		setIsPickup,
		setDeliveryAddressId,
		setDeliveryAddress,
		setBillingAddress,
	} = useOrders();

	const customerAction = isDelivery ? 'database' : 'pickup';

	const [pickupState, setPickupState] = useState<string>(customerAction);

	function setAddress(userAddress: FormInput, name: string) {
		const localOrder = localStorage.getItem('usersOrder');
		const parsedOrder = JSON.parse(localOrder!);

		const address = {
			name: auth.firstName + ' ' + auth.lastName,
			address: userAddress.address,
			city: userAddress.city,
			state_province: userAddress.state_province,
			postal_code: userAddress.postal_code,
			country: userAddress.country,
		};

		name === 'deliveryAddress'
			? setDeliveryAddress(address)
			: setBillingAddress(address);

		localStorage.setItem(
			'usersOrder',
			JSON.stringify({
				...parsedOrder,
				[name]: { ...address },
			})
		);
	}

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
				setAddress(userAddress[0], 'billingAddress');
				setAddress(userAddress[0], 'deliveryAddress');
			} catch (error: any) {
				setHasError(error);
			}
		};

		fetchUser();
		setPickupState(isManualAddress ? 'manual' : customerAction);
		setIsManualAddress(pickupState === 'manual' ? true : false);
	}, []);

	const handleDeliverySelection = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const val = event.target.value;
		console.log('delivery instructions:', val);
		setPickupState(val);
		setIsManualAddress(val === 'manual');
		setIsPickup(val === 'pickup');
	};

	const handleAddressSelection = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		event.preventDefault();
		const idx = parseInt(event.target.value, 10);
		setAddressIdx(idx);
		setDeliveryAddressId(userAddress[idx].address_id);
		setAddress(userAddress[idx], 'deliveryAddress');
		setIsManualAddress(false);
		setPickupState(customerAction);
		const usersOrder = localStorage.getItem('usersOrder');
		const parsedOrder = JSON.parse(usersOrder!);
		localStorage.setItem(
			'usersOrder',
			JSON.stringify({ ...parsedOrder, isManualAddress: false })
		);
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
									{userAddress[addressIdx].city}
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
							<ManualAddress />
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
							<PickupOption />
						</div>
					</CSSTransition>
				</div>
			</div>
		</form>
	);
}

export default CustomerAddress;
