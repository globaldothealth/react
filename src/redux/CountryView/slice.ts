import { createSlice } from '@reduxjs/toolkit';
import { fetchCountriesData } from './thunks';
import { CountryData } from 'models/CountryData';

interface CountryViewState {
    isLoading: boolean;
    error: string | undefined;
    countriesData: CountryData[];
}

const initialState: CountryViewState = {
    isLoading: false,
    error: undefined,
    countriesData: [],
};

export const countryViewSlice = createSlice({
    name: 'countryView',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCountriesData.pending, (state) => {
            state.isLoading = true;
            state.error = undefined;
        });
        builder.addCase(fetchCountriesData.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.countriesData = payload;
        });
        builder.addCase(fetchCountriesData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload
                ? action.payload
                : action.error.message;
        });
    },
});

export default countryViewSlice.reducer;
