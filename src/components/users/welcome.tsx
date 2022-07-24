import React, { useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';

const Welcome = () => {
	const auth = useContext(AuthContext);

	return (
		<article className='page_default'>
			<p className='message'>
				Hello {auth.firstName} {auth.lastName}, You have been logged in.
			</p>
			<p>
				<strong>Welcome to our on-line store.</strong>
			</p>
		</article>
	);
};

export default Welcome;
