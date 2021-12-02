import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VariantsDataRow } from 'models/VariantsDataRow';
import { fetchVariantsData } from './thunks';

interface VariantsViewState {
    variantsData: VariantsDataRow[];
    chosenVariant: string;
}

const initialState: VariantsViewState = {
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
        builder.addCase(fetchVariantsData.fulfilled, (state, { payload }) => {
            state.variantsData = payload;
        });
    },
});

export const { setChosenVariant } = variantsViewSlice.actions;

export default variantsViewSlice.reducer;
