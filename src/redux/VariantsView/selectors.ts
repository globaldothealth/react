import { RootState } from 'redux/store';

export const selectVariantsData = (state: RootState) =>
    state.variantsView.variantsData;
export const selectChosenVariant = (state: RootState) =>
    state.variantsView.chosenVariant;
