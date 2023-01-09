import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import useManageCart from './shared/hooks/use-manageCart';

import CategoryDetail from './components/product-categories/category-detail';
import CategoryList from './components/product-categories/category-list';
import ProductDetail from './components/product-categories/product-detail/product-detail';
import ShoppingCart from './components/cart/shopping-cart';
import Registration from './components/users/create-user';
import UserLogin from './components/users/user-login';
import Welcome from './components/users/welcome';
import ContentWrapper from './components/content/content-wrapper';
import Layout from './components/page-elements/Layout';
import Profile from './components/users/profile';
import ChangePassword from './components/users/change-password';
import { ForgotPassword } from './components/users/forgot-password';
import ResetPassword from './components/users/reset-password';
import UserSuccess from './components/users/create-user-success';
import Checkout from './components/cart//checkout/checkout';
import CustomerInformation from './components/cart/checkout/customer-information';
import Confirmation from './components/cart/checkout/confirmation';
import BillingPayments from './components/cart/checkout/billing-payment';
import ShippingDelivery from './components/cart/checkout/shipping-delivery';
import Results from './components/search/results';

import TestRedux from './components/product-categories/test-redux';
import TestImages from './components/product-categories/test-images';
import TestGetImages from './components/product-categories/test-get-images';

import './App.css';

const queryClient = new QueryClient();

const ShoppingCartRoutes = () => {
	return (
		<>
			<Route path='/shopping-cart' element={<ShoppingCart />} />
			<Route path='/checkout' element={<Checkout />}>
				<Route index element={<CustomerInformation />} />
				<Route
					path='customer-information'
					element={<CustomerInformation />}
				/>
				<Route
					path='/checkout/billing-payment'
					element={<BillingPayments />}
				/>
				<Route
					path='/checkout/shipping-delivery'
					element={<ShippingDelivery />}
				/>
				<Route
					path='/checkout/confirmation'
					element={<Confirmation />}
				/>
			</Route>
		</>
	);
};

const AuthenticationRoutes = () => {
	return (
		<>
			<Route path='/login' element={<UserLogin />} />
			<Route path='/login/:login/*' element={<UserLogin />} />
			<Route path='/user/create-account' element={<Registration />} />
			<Route path='/user/profile' element={<Profile />} />
			<Route
				path='/user/change-password/*'
				element={<ChangePassword />}
			/>
			<Route path='/user/forgot-password' element={<ForgotPassword />} />
			<Route
				path='/user/reset-password/:token'
				element={<ResetPassword />}
			/>
			<Route path='/user/success/:message' element={<UserSuccess />} />
			<Route path='/user/success' element={<UserSuccess />} />
		</>
	);
};

const InformationalRoutes = () => {
	return (
		<>
			<Route
				path='services'
				element={<ContentWrapper title={'Services'} />}
			/>
			<Route
				path='resources'
				element={<ContentWrapper title={'Resource'} />}
			/>
			<Route
				path='sustainability'
				element={<ContentWrapper title={'Sustainability'} />}
			/>
			<Route path='faq' element={<ContentWrapper title={'FAQ'} />} />
			<Route
				path='contact-us'
				element={<ContentWrapper title={'Contact Us'} />}
			/>
		</>
	);
};

function App() {
	const { loadUnknownUserCart } = useManageCart();
	const {
		userId,
		username,
		email,
		firstName,
		lastName,
		phone,
		token,
		login,
		logout,
		updateUserSession,
	} = useAuth();

	useEffect(() => {
		loadUnknownUserCart();
	}, []);

	return (
		<>
			{console.log('Loading the App!')}
			<QueryClientProvider client={queryClient}>
				<AuthContext.Provider
					value={{
						isLoggedIn: !!token,
						token,
						userId,
						email,
						username,
						firstName,
						lastName,
						phone,
						login,
						logout,
						updateUserSession,
					}}>
					<Routes>
						<Route path='/' element={<Layout />}>
							<Route path='/' element={<CategoryList />} />
							<Route path='/home' element={<CategoryList />} />
							<Route
								path='/products'
								element={<CategoryList />}
							/>
							<Route
								path='/category/:categoryId/product/:productId/sku/:sku'
								element={<ProductDetail />}
							/>
							<Route
								path='/category/:categoryId/product/:productId'
								element={<ProductDetail />}
							/>
							<Route
								path='/category/:categoryId/*'
								element={<CategoryDetail />}
							/>

							{/* Shopping Cart and Checkout Routes */}
							{ShoppingCartRoutes()}

							{/* Login, Profile and Registration Routes */}
							{AuthenticationRoutes()}

							<Route
								path='/search/:searchTerm'
								element={<Results />}
							/>
							<Route path='/welcome' element={<Welcome />} />

							{/* No product routes */}
							{InformationalRoutes()}

							<Route path='/test-redux' element={<TestRedux />} />
							<Route
								path='/test-image'
								element={<TestImages />}
							/>
							<Route
								path='/get-test-image'
								element={<TestGetImages />}
							/>
						</Route>
					</Routes>
				</AuthContext.Provider>
				<ReactQueryDevtools />
			</QueryClientProvider>
		</>
	);
}

export default App;
