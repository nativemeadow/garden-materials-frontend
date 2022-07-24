import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';

import classes from './create-user.module.css';

const UserSuccess = () => {
	const { message } = useParams();
	const auth = useContext(AuthContext);
	const navigate = useNavigate();
	const [messageText, setMessageText] = useState('Success');

	useEffect(() => {
		if (!auth.isLoggedIn && message?.length === 0) {
			navigate('/login');
		}

		if (message?.length! > 0) {
			setMessageText(message!);
		}
	}, [auth.isLoggedIn, navigate, message]);

	return (
		<div className={classes['center']}>
			<h1 className={classes['message']}>{messageText}</h1>
		</div>
	);
};

export default UserSuccess;
