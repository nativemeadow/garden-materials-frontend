import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../redux/store';

type purchaseState = {
	productQty: number;
	productSize: string;
	selectedValue: string;
};

const initialState: purchaseState = {
	productQty: 0,
	productSize: '',
	selectedValue: '',
};

export const productSlice = createSlice({
	name: 'selectedProduct',
	initialState,
	reducers: {
		updateProductQty: (state, action: PayloadAction<number>) => {
			state.productQty = action.payload;
		},
		updateProductSize: (state, action: PayloadAction<string>) => {
			state.productSize = action.payload;
		},
		updateSelectedValue: (state, action: PayloadAction<string>) => {
			state.selectedValue = action.payload;
		},
	},
});

export const { updateProductQty, updateProductSize, updateSelectedValue } =
	productSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.;

// export default counterSlice.reducer;
