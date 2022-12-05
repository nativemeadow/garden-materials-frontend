import React, { useEffect, useState } from 'react';
import { useForm, formStateIf } from '../../../shared/hooks/form-hook';
import SimpleInput from '../../../shared/components/FormElements/SimpleInput';
import { VALIDATOR_REQUIRE } from '../../../shared/util/validators';
import { statesProvinces } from '../../../shared/counties-locals/location-lookup';
import useOrders from '../../../zustand/userOrders';
import classes from './customer-address.module.css';

const manualDeliveryAddress = {
	name: { value: '', isValid: false },
	address: { value: '', isValid: false },
	city: { value: '', isValid: false },
	postal_code: { value: '', isValid: false },
	state_province: { value: '', isValid: false },
	country: { value: '', isValid: false },
};

const parseInputs = (inputs: any) => {
	const newInputs: formStateIf = {};
	for (const inputId in inputs) {
		newInputs[inputId] = {
			value: inputs[inputId],
			isValid: true,
		};
	}
	return newInputs;
};

export const ManualAddress = () => {
	const [formState, inputHandler, setFormData] = useForm(
		manualDeliveryAddress,
		false
	);
	const { setDeliveryAddress, setManualAddress, setIsManualAddress } =
		useOrders();
	const userOrders = useOrders((state) => state);

	useEffect(() => {
		setManualAddress({
			name: formState.inputs.name?.value,
			address: `${formState.inputs.address?.value}`,
			city: formState.inputs.city?.value,
			postal_code: formState.inputs.postal_code?.value,
			state_province: formState.inputs.state_province?.value,
			country: 'USA',
		});
		console.log('update the manual address');
	}, [
		formState.inputs,
		setIsManualAddress,
		setManualAddress,
		setDeliveryAddress,
	]);

	useEffect(() => {
		console.log('loading manual address: ', userOrders.manualAddress);
		setFormData(parseInputs(userOrders.manualAddress), true);
		console.log('formState: ', formState);
	}, []);

	const changeHandler = (
		event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>
	) => {
		const val = event.target.value;
		const name = event.target.name;
		inputHandler(name, val, true);
	};

	return (
		<div className={classes['manual-address']}>
			<SimpleInput
				id='name'
				name='name'
				type='text'
				label={'Name'}
				value={userOrders.manualAddress?.name}
				onInput={inputHandler}
				validators={[VALIDATOR_REQUIRE()]}
				parentStyles={classes}
				initialIsValid={false}
				errorText='Please enter name for address.'
				placeholder='Name'
				cssField={classes['deliver-to-name']}
				cssErrorWrapper={'col-start-1'}
			/>

			<SimpleInput
				id='address'
				name='address'
				type='text'
				label={'Address Line'}
				value={userOrders.manualAddress?.address}
				onInput={inputHandler}
				validators={[VALIDATOR_REQUIRE()]}
				parentStyles={classes}
				initialIsValid={false}
				errorText='Please enter address.'
				placeholder='Address Line'
				cssErrorWrapper={'col-start-1'}
			/>

			<div className='md:flex gap-5 w-full'>
				<SimpleInput
					id='city'
					name='city'
					type='text'
					label={'City'}
					value={userOrders.manualAddress?.city}
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
						onChange={changeHandler}
						value={userOrders.manualAddress?.state_province}
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
					value={userOrders.manualAddress?.postal_code}
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
