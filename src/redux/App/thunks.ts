import { createAsyncThunk } from '@reduxjs/toolkit';
import { CountryDataRow, TotalCasesValues } from 'models/CountryData';

// Fetch countries data from AWS S3 JSON file
export const fetchCountriesData = createAsyncThunk<
    CountryDataRow[],
    void,
    { rejectValue: string }
>('app/fetchCountriesData', async (_, { rejectWithValue }) => {
    const dataUrl = process.env.REACT_APP_COUNTRY_VIEW_DATA_URL;

    try {
        if (!dataUrl) throw new Error('Data url missing');

        const response = await fetch(dataUrl);
        if (response.status !== 200)
            throw new Error('Fetching countries data failed');

        const jsonResponse = await response.json();

        const keys = Object.keys(jsonResponse);
        if (keys.length === 0) throw new Error('Wrong data format');
        const latestKey = keys[0];

        const countriesData = jsonResponse[latestKey] as CountryDataRow[];
        return countriesData;
    } catch (err: any) {
        if (err.response) return rejectWithValue(err.response.message);

        throw err;
    }
});

export const fetchTotalCases = createAsyncThunk<
    TotalCasesValues,
    void,
    { rejectValue: string }
>('app/fetchTotalCases', async (_, { rejectWithValue }) => {
    const dataUrl = process.env.REACT_APP_TOTAL_CASES_URL;

    try {
        if (!dataUrl) throw new Error('Data url missing');

        const response = await fetch(dataUrl);
        if (response.status !== 200)
            throw new Error('Fetching total cases number failed');

        const jsonResponse = await response.json();

        console.log(jsonResponse);

        const keys = Object.keys(jsonResponse);
        if (keys.length === 0) throw new Error('Wrong data format');
        const latestKey = keys[0];

        const totalCases = jsonResponse[latestKey] as TotalCasesValues;
        return totalCases;
    } catch (err: any) {
        if (err.response) return rejectWithValue(err.response.message);

        throw err;
    }
});
