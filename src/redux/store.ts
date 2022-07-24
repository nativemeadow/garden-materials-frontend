import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../components/product-categories/category-list-slice';

const store = configureStore({
	reducer: { categories: categoriesReducer },
});

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
