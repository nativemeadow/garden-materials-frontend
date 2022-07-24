import React, { useState } from 'react';
import useManageCart from '../../../shared/hooks/use-manageCart';
import classes from './customer-information.module.css';
import Registration from '../../users/create-user';

export const RegisterNewCustomer = () => {
	const [guestUser, setGuestUser] = useState(false);

	const handleGuestUser = () => {
		console.log('guest user', guestUser);
		setGuestUser(!guestUser);
	};

	return (
		<div className={'customer-info-form-registration'}>
			<div className={'customer-registration-container'}>
				<div className='flex items-center ml-2'>
					<label htmlFor='guest_user'>
						<input
							type='checkbox'
							id='guest_user'
							name='guestUser'
							value='manual'
							onChange={handleGuestUser}
						/>
					</label>
					<span className='font-normal text-base p-2'>
						Continue Without Create An Account
					</span>
				</div>

				<Registration
					heading={false}
					atCheckout={true}
					usernameId={'username'}
					passwordId={'password'}
					guestUser={guestUser}
					loadCart={useManageCart().loadCart}
					containerClass={classes['reg-login__container']}
					credentialsClass={classes['reg-login-information']}
					regErrorWrapperClass={'col-start-1'}
					overrideCSS={classes}
				/>
			</div>
		</div>
	);
};
