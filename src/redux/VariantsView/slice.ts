import { createSlice } from '@reduxjs/toolkit';
import { VariantsDataRow } from 'models/VariantsDataRow';
import { fetchVariantsData } from './thunks';

interface VariantsViewState {
    variantsData: VariantsDataRow[];
}

const initialState: VariantsViewState = {
    variantsData: [],
};

const variantsViewSlice = createSlice({
    name: 'variantsView',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchVariantsData.fulfilled, (state, { payload }) => {
            state.variantsData = payload;
        });
    },
});

export default variantsViewSlice.reducer;
