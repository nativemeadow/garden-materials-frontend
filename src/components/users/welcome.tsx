import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';

const Welcome = () => {
	const auth = useContext(AuthContext);

	return (
		<article className='page_default'>
			{auth.isLoggedIn && (
				<>
					<p className='message'>
						Hello {auth.firstName} {auth.lastName}, You have been
						logged in.
					</p>
					<p>
						<strong>Welcome to our on-line store.</strong>
					</p>
				</>
			)}
			{!auth.isLoggedIn && (
				<p className='message'>
					You are no longer logged in. Please&nbsp;
					<NavLink to='/login'>login</NavLink> to continue.
				</p>
			)}
		</article>
	);
};

export default Welcome;
