import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Category } from '../../shared/interfaces/category-list';
import httpFetch from '../../shared/http/http-fetch';
import configData from '../../config.json';

type SliceState = {
	categories: [];
	status: string;
	error: string | null;
};

const initialState = {
	categories: [],
	status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
	error: null,
} as SliceState;

export const fetchCategories = createAsyncThunk(
	'categories/fetchCategories',
	async () => {
		try {
			const responseData = await httpFetch(
				`${configData.BACKEND_URL}/categories`
			);
			return responseData;
		} catch (error: any) {
			throw new Error(error);
		}
	}
);

const categorySlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(fetchCategories.pending, (state, _action) => {
				state.status = 'loading';
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				return (state = {
					...state,
					status: 'succeeded',
					categories: action.payload as [],
				});
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message!;
			});
	},
});

export const selectAllCategories = (state: any) => state.categories;
export const getCategoriesStatus = (state: any) => state.categories.status;
export const getCategoriesError = (state: any) => state.categories.error;

export default categorySlice.reducer;
