import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context';
import Button from '../../shared/components/FormElements/SimpleButton';
import Dropdown from '../../shared/components/UIElements/Dropdown';
import { useManageUsers } from '../../shared/hooks/use-manageUsers';

import classes from './TopBar.module.css';

const TopBar: React.FC = (props: {}) => {
	const auth = useContext(AuthContext);
	const location = useLocation();
	const navigate = useNavigate();
	const userManager = useManageUsers(); // custom hook

	const logoutHandler = () => {
		userManager.logoutHandler(auth);
		auth.logout();
		navigate('/login');
	};

	return (
		<div className={classes['top-bar']}>
			<div className={classes['container']}>
				<ul className={classes['top-bar__items']}>
					<li className={classes['top-bar__item']}>
						{!auth.isLoggedIn && (
							<Link
								to={`/login`}
								state={{ from: location, replace: true }}>
								Account Login
							</Link>
						)}
						{auth.isLoggedIn && (
							<Dropdown user={`Hi ${auth.firstName!}`}>
								<Link to={`/user/profile`}>Profile</Link>
								<Link
									to={`/user/change-password/${auth.userId}`}>
									Change password
								</Link>
								<Button
									override={classes['button--default']}
									size='small'
									type='button'
									onClick={logoutHandler}>
									LOGOUT
								</Button>
							</Dropdown>
						)}
					</li>
					<li className={classes['top-bar__item']}>
						<a href='#'>Company</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default TopBar;
