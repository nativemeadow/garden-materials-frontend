import React, {
	useEffect,
	useContext,
	useState,
	useRef,
	type RefObject,
} from 'react';
import { IoChevronForward } from 'react-icons/io5';

import { CSSTransition } from 'react-transition-group';

import classes from './customer-information.module.css';
import { AuthContext } from '../../../shared/context/auth-context';
import CustomerAddress from './customer-address';

import './customer-information.css';
import { RegisterNewCustomer } from './register-new-customer';
import { LoginUser } from './login-user';

export default function CustomerInformation() {
	const auth = useContext(AuthContext);

	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const nodeRef = useRef(null);

	useEffect(() => {}, []);

	return (
		<div className={classes['content-wrapper']}>
			{auth.isLoggedIn && <CustomerAddress />}
			{!auth.isLoggedIn && (
				<>
					<div
						ref={nodeRef}
						className='flex'
						onClick={(event: React.MouseEvent<HTMLDivElement>) => {
							setShowLogin(!showLogin);
							setShowRegister(false);
						}}>
						<h3 className='font-bold py-3 cursor-pointer'>
							Existing Customers
						</h3>
						<span className='self-center pl-1 text-2xl text-red-800 cursor-pointer'>
							{showLogin ? (
								<IoChevronForward
									style={{
										transform: 'rotate(90deg)',
										transition: 'all 0.3s ease-in-out',
									}}
								/>
							) : (
								<IoChevronForward
									style={{
										transform: 'rotate(0deg)',
										transition: 'all 0.3s ease-in',
									}}
								/>
							)}
						</span>
					</div>

					<CSSTransition
						in={showLogin}
						timeout={200}
						classNames={'options'}>
						<div className='options'>
							<LoginUser />
						</div>
					</CSSTransition>

					<hr className={classes.divider} />
					<div
						ref={nodeRef}
						className='flex'
						onClick={(event: React.MouseEvent<HTMLDivElement>) => {
							setShowRegister(!showRegister);
							setShowLogin(false);
						}}>
						<h3 className='font-bold py-3 cursor-pointer'>
							New Customers
						</h3>
						<span className='self-center pl-1 text-2xl text-red-800 cursor-pointer'>
							{showRegister ? (
								<IoChevronForward
									style={{
										transform: 'rotate(90deg)',
										transition: 'all 0.3s ease-in-out',
									}}
								/>
							) : (
								<IoChevronForward
									style={{
										transform: 'rotate(0deg)',
										transition: 'all 0.3s ease-in',
									}}
								/>
							)}
						</span>
					</div>

					<CSSTransition
						in={showRegister}
						timeout={200}
						classNames='options'>
						<div className='options'>
							<RegisterNewCustomer />
						</div>
					</CSSTransition>
				</>
			)}
		</div>
	);
}
