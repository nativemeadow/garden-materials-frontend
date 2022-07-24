import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import configData from '../../config.json';


export const apiSlice = createApi({
    reducerPath: 'api', // optional
    baseQuery: fetchBaseQuery({ baseUrl: configData.BACKEND_URL }),
    tagTypes: ['Category', 'SubCategory', 'Product', 'User'],
    endpoints: builder => ({})
})