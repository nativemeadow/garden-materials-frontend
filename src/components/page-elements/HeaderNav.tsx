import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Hamburger from './ResponsiveMenu';
import NavLinks from './NavLinks';
import { useWindowSize } from '../../shared/hooks/widowSize-hook';
import Backdrop from '../../shared/components/UIElements/Backdrop';
import { CSSTransition } from 'react-transition-group';
import useShoppingCart from '../../zustand/shoppingCart';

import classes from './HeaderNav.module.css';

const HeaderNav: React.FC = () => {
	const [openResponsive, setOpenResponsive] = useState(false);
	const windowSize = useWindowSize();
	const searchRef = useRef<HTMLInputElement>(null);
	const shoppingCart = useShoppingCart((state) => state);
	const navigate = useNavigate();

	const searchHandler = (event: React.FormEvent) => {
		event.preventDefault();

		const searchTerms = searchRef.current?.value;

		console.log('search button clicked, entered:', searchTerms);
		navigate(`/search/${searchTerms}`);
	};

	const closeResponsiveMenu = () => {
		setOpenResponsive(false);
	};

	useLayoutEffect(() => {
		windowSize.width! > 1024 && setOpenResponsive(false);
	}, [windowSize.width]);

	return (
		<>
			{openResponsive && <Backdrop onClick={closeResponsiveMenu} />}
			<header className={classes['main-header']}>
				<div className={classes['main-header__container']}>
					<div className={classes['site-logo']}>
						<NavLink to='/home'>
							<img
								className={classes['site-logo__image']}
								src='/images/terrace-logo.png'
								alt='Lyngso logo'
							/>
						</NavLink>
					</div>
					<nav className={classes['main-nav']}>
						<NavLinks />
						<div id='search-2' className={classes['nav-search']}>
							<form
								onSubmit={searchHandler}
								aria-label='search from - search for products'
								className={classes['nav-search-form']}>
								<input
									type='hidden'
									name='mode'
									value='searchStore'
								/>
								<input
									className={classes['nav-search__input']}
									title='Product search...'
									ref={searchRef}
									type='search'
									name='search[searchFor]'
									placeholder='Product search ...'
									required={true}
								/>
								<button
									className={`${classes['nav-search']}  ${classes['nav-search__button']}`}
									type='submit'
									aria-label='Search'
									title='Search'>
									<span
										className='fa fa-search'
										aria-hidden='true'></span>
								</button>
							</form>
						</div>
						<div id='shopping-cart'>
							<NavLink
								to='shopping-cart'
								className={classes['shopping--cart__link']}>
								<img src='/images/icon-cart.png' alt='shop' />
								<span
									className={
										classes['shopping--cart__count']
									}>
									{shoppingCart.cartCount()}
								</span>
							</NavLink>
						</div>
					</nav>
					<nav className={classes['main-responsive__nav']}>
						<div id='shopping-cart'>
							<NavLink
								to='shopping-cart'
								className={classes['shopping--cart__link']}>
								<img src='/images/icon-cart.png' alt='shop' />
								<span
									className={
										classes['shopping--cart__count']
									}>
									{shoppingCart.cartCount()}
								</span>
							</NavLink>
						</div>
						<Hamburger
							openResponsive={openResponsive}
							setOpenResponsive={setOpenResponsive}
						/>
					</nav>
				</div>
			</header>
			<CSSTransition
				in={openResponsive}
				timeout={200}
				classNames='slide-in-top'
				mountOnEnter
				unmountOnExit>
				<div
					onClick={closeResponsiveMenu}
					className={`${
						classes['main-responsive__menu']
						// openResponsive
						// ? classes['main-responsive__menu']
						// : classes['main-responsive__menu--hide']
					}`}>
					<NavLinks />
				</div>
			</CSSTransition>
		</>
	);
};

export default HeaderNav;
