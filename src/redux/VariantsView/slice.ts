import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VariantsDataRow } from 'models/VariantsDataRow';
import { fetchVariantsData } from './thunks';

interface VariantsViewState {
    isLoading: boolean;
    variantsData: VariantsDataRow[];
    chosenVariant: string;
}

const initialState: VariantsViewState = {
    isLoading: false,
    variantsData: [],
    chosenVariant: 'total_b.1.1.7',
};

const variantsViewSlice = createSlice({
    name: 'variantsView',
    initialState,
    reducers: {
        setChosenVariant: (state, action: PayloadAction<string>) => {
            state.chosenVariant = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchVariantsData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchVariantsData.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.variantsData = payload;
        });
        builder.addCase(fetchVariantsData.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setChosenVariant } = variantsViewSlice.actions;

export default variantsViewSlice.reducer;
