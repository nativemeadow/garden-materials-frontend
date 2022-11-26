import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import store from '../src/redux/store';
import './index.css';
import App from './App';
import ScrollToTop from './shared/util/scroll-to-top';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
	// <StrictMode>
	<Provider store={store}>
		<Router>
			<ScrollToTop />
			<Routes>
				<Route path='/*' element={<App />} />
			</Routes>
		</Router>
	</Provider>
	// </StrictMode>
);
