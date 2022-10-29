import React, { useEffect } from 'react';
import { useForm } from '../../../shared/hooks/form-hook';
import SimpleInput from '../../../shared/components/FormElements/SimpleInput';
import { VALIDATOR_REQUIRE } from '../../../shared/util/validators';
import { statesProvinces } from '../../../shared/counties-locals/location-lookup';
import useOrders from '../../../zustand/userOrders';
import classes from './customer-address.module.css';
import { manualAddress } from '../../../shared/interfaces/customerInfo';

const manualDeliveryAddress = {
	name: { value: '', isValid: false },
	address1: { value: '', isValid: false },
	address2: { value: '', isValid: false },
	city: { value: '', isValid: false },
	postal_code: { value: '', isValid: false },
	state_province: { value: '', isValid: false },
	country: { value: '', isValid: false },
};
export const ManualAddress = (manualAddress: manualAddress) => {
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
						onChange={changeHandler}
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
