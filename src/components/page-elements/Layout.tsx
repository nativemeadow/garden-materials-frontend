import React from 'react';
import { Outlet } from 'react-router-dom';

import TopBar from '../../components/page-elements/TopBar';
import HeaderNav from '../../components/page-elements/HeaderNav';
import Footer from '../../components/page-elements/Footer';
import Connect from '../../components/page-elements/Connect';
import Signup from '../../components/page-elements/Signup';

const Layout = (props: {}) => {
	return (
		<>
			<TopBar />
			<HeaderNav />
			<main className='container'>
				<Outlet />
			</main>
			<Signup />
			<Connect />
			<Footer />
		</>
	);
};

export default Layout;
