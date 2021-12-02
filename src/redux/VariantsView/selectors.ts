import { RootState } from 'redux/store';

export const selectVariantsData = (state: RootState) =>
    state.variantsView.variantsData;
