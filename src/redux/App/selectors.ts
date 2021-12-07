import type { RootState } from 'redux/store';

export const selectIsLoading = (state: RootState) => state.app.isLoading;
export const selectError = (state: RootState) => state.app.error;
export const selectCountriesData = (state: RootState) =>
    state.app.countriesData;
export const selectTotalCases = (state: RootState) =>
    state.app.totalNumberOfCases;
