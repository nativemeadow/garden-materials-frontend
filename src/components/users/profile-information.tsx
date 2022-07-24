import React, { ChangeEvent } from 'react';
import {
	statesProvinces,
	countries,
} from '../../shared/counties-locals/location-lookup';
import SimpleInput from '../../shared/components/FormElements/SimpleInput';
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_EMAIL,
} from '../../shared/util/validators';

import styles from './create-user.module.css';
import componentClasses from './profile-information.module.css';

interface Props {
	inputVal: any;
	initialIsValid: boolean;
	onInput: (id: string, value: string | number, isValid: boolean) => void;
	changeHandler: (
		event: ChangeEvent<HTMLInputElement & HTMLSelectElement>
	) => void;
	children?: React.ReactNode;
	parentStyles?: { readonly [key: string]: string };
	cssField?: string;
	cssErrorWrapper?: string;
	cssError?: string;
}

const ProfileInformation: React.FC<Props> = ({
	inputVal,
	initialIsValid,
	onInput = (id: string, value: string | number, isValid: boolean) => {},
	changeHandler = (
		event: ChangeEvent<HTMLInputElement & HTMLSelectElement>
	) => {},
	children,
	parentStyles,
	cssField,
	cssErrorWrapper,
	cssError,
}) => {
	const classes = parentStyles ? parentStyles : styles;

	return (
		<>
			{children}
			<div className={classes['reg-login-name-address']}>
				<SimpleInput
					id='first_name'
					name='first_name'
					type='text'
					label={'First Name'}
					value={inputVal.inputs.first_name.value}
					onInput={onInput}
					validators={[VALIDATOR_REQUIRE()]}
					initialIsValid={initialIsValid}
					errorText='Please enter your first name.'
					placeholder='First Name'
					parentStyles={parentStyles}
					cssErrorWrapper={cssErrorWrapper}
				/>
				<SimpleInput
					id='last_name'
					name='last_name'
					type='text'
					label={'Last Name'}
					value={inputVal.inputs.last_name.value}
					onInput={onInput}
					validators={[VALIDATOR_REQUIRE()]}
					initialIsValid={initialIsValid}
					errorText='Please enter your last name.'
					placeholder='Last Name'
					parentStyles={parentStyles}
					cssErrorWrapper={cssErrorWrapper}
				/>
				<SimpleInput
					id='email'
					name='email'
					type='email'
					label={'Email Address'}
					value={inputVal.inputs.email.value}
					onInput={onInput}
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
					initialIsValid={initialIsValid}
					errorText='Please enter your email address.'
					placeholder='Email Address'
					parentStyles={parentStyles}
					cssErrorWrapper={cssErrorWrapper}
				/>
				<div className={classes['form-fields-grid']}>
					<label
						className={classes['form-field-label']}
						htmlFor='phone'>
						Phone
					</label>
					<input
						className={componentClasses['form-field']}
						type='text'
						id='phone'
						name='phone'
						value={inputVal.inputs.phone?.value}
						onChange={changeHandler}
					/>
				</div>

				<div className={classes['form-fields-grid']}>
					<label
						className={classes['form-field-label']}
						htmlFor='address'>
						Address
					</label>
					<input
						className={componentClasses['form-field']}
						type='text'
						id='address'
						name='address'
						value={inputVal.inputs.address?.value}
						onChange={changeHandler}
					/>
				</div>
				<div className={classes['form-fields-grid']}>
					<label
						className={classes['form-field-label']}
						htmlFor='city'>
						City
					</label>
					<input
						className={componentClasses['form-field']}
						type='text'
						id='city'
						name='city'
						value={inputVal.inputs.city?.value}
						onChange={changeHandler}
					/>
				</div>
				<div className={classes['form-fields-grid']}>
					<label
						className={classes['form-field-label']}
						htmlFor='country'>
						Country
					</label>
					<select
						className={componentClasses['form-field']}
						id='country'
						onChange={changeHandler}
						value={inputVal.inputs.country?.value}
						name='country'>
						{countries.map((country, index) => {
							return (
								<option key={index} value={country.code}>
									{country.name}
								</option>
							);
						})}
					</select>
				</div>
				<div className={classes['form-fields-grid']}>
					<label
						className={classes['form-field-label']}
						htmlFor='state_province'>
						State / Province
					</label>
					<select
						className={componentClasses['form-field']}
						id='state_province'
						onChange={changeHandler}
						value={inputVal.inputs.state_province?.value}
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
				<div className={classes['form-fields-grid']}>
					<label
						className={classes['form-field-label']}
						htmlFor='postal_code'>
						Postal Code
					</label>
					<input
						className={componentClasses['form-field']}
						type='text'
						id='postal_code'
						name='postal_code'
						value={inputVal.inputs.postal_code?.value}
						onChange={changeHandler}
					/>
				</div>

				<div className={classes['form-fields-grid']}>
					<label
						className={classes['form-field-label']}
						htmlFor='company'>
						Company
					</label>
					<input
						className={componentClasses['form-field']}
						type='text'
						id='company'
						name='company'
						value={inputVal.inputs.company?.value}
						onChange={changeHandler}
					/>
				</div>
			</div>
		</>
	);
};

export default ProfileInformation;
