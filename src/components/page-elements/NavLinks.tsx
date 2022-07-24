import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

// import { MainNavData, NavData } from '../../shared/navigation/main-navigation';

import classes from './HeaderNav.module.css';

const NavLinks = () => {
	return (
		<ul className={classes['main-nav__items']}>
			<li className={classes['main-nav__item']}>
				<NavLink
					to='/products'
					className={(navData) =>
						navData.isActive ? classes['active'] : ''
					}>
					Products
				</NavLink>
			</li>
			<li className={classes['main-nav__item']}>
				<NavLink
					to='/services'
					className={(navData) =>
						navData.isActive ? classes['active'] : ''
					}>
					Services
				</NavLink>
			</li>
			<li className={classes['main-nav__item']}>
				<NavLink
					to='/resources'
					className={(navData) =>
						navData.isActive ? classes['active'] : ''
					}>
					Resources
				</NavLink>
			</li>
			<li className={classes['main-nav__item']}>
				<NavLink
					to='/sustainability'
					className={(navData) =>
						navData.isActive ? classes['active'] : ''
					}>
					Sustainability
				</NavLink>
			</li>
			<li className={classes['main-nav__item']}>
				<NavLink
					to='/faq'
					className={(navData) =>
						navData.isActive ? classes['active'] : ''
					}>
					FAQ
				</NavLink>
			</li>
			<li className={classes['main-nav__item']}>
				<NavLink
					to='/contact-us'
					className={(navData) =>
						navData.isActive ? classes['active'] : ''
					}>
					Contact Us
				</NavLink>
			</li>
		</ul>
	);
};

export default NavLinks;
