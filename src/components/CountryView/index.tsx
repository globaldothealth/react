import { useRef, useEffect } from 'react';
import { useMapboxMap } from 'hooks/useMapboxMap';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import * as countryViewSelectors from 'redux/CountryView/selectors';
import { fetchCountriesData } from 'redux/CountryView/thunks';
import { setMapLoaded } from 'redux/CountryView/slice';
import countryLookupTable from 'data/admin0-lookup-table.json';
import { CasesNumberColors } from 'models/Colors';
import { MapSourceDataEvent, EventData } from 'mapbox-gl';

import { MapContainer } from 'theme/globalStyles';

const CountryView: React.FC = () => {
    const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(countryViewSelectors.selectIsLoading);
    const error = useAppSelector(countryViewSelectors.selectError);
    const countriesData = useAppSelector(
        countryViewSelectors.selectCountriesData,
    );
    const mapLoaded = useAppSelector(countryViewSelectors.selectMapLoaded);

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useMapboxMap(mapboxAccessToken, mapContainer);

    const lookupTableData = countryLookupTable.adm0.data.all as {
        [key: string]: any;
    };

    // Fetch countries data
    useEffect(() => {
        dispatch(fetchCountriesData());
    }, []);

    // Setup map
    useEffect(() => {
        const mapRef = map.current;
        if (!mapRef) return;

        mapRef.on('load', () => {
            mapRef.addSource('countriesData', {
                type: 'vector',
                url: 'mapbox://mapbox.country-boundaries-v1',
            });

            // Setup map listener to check if map has loaded
            const setAfterSourceLoaded = (
                e: MapSourceDataEvent & EventData,
            ) => {
                if (e.sourceID !== 'countriesData' && !e.isSourceLoaded) return;
                dispatch(setMapLoaded(true));
                mapRef.off('sourcedata', setAfterSourceLoaded);
            };

            if (mapRef.isSourceLoaded('countriesData')) {
                dispatch(setMapLoaded(true));
            } else {
                mapRef.on('sourcedata', setAfterSourceLoaded);
            }
        });
    }, []);

    // Display countries data on the map
    useEffect(() => {
        if (isLoading || countriesData.length === 0 || !mapLoaded) return;
        const mapRef = map.current;
        if (!mapRef) return;

        for (const countryRow of countriesData) {
            if (lookupTableData[countryRow.code]) {
                mapRef.setFeatureState(
                    {
                        source: 'countriesData',
                        sourceLayer: 'country_boundaries',
                        id: lookupTableData[countryRow.code].feature_id,
                    },
                    {
                        caseCount: countryRow.casecount,
                    },
                );
            }
        }

        mapRef.addLayer(
            {
                id: 'countries-join',
                type: 'fill',
                source: 'countriesData',
                'source-layer': 'country_boundaries',
                paint: {
                    'fill-color': [
                        'case',
                        ['!=', ['feature-state', 'caseCount'], null],
                        [
                            'case',
                            ['<', ['feature-state', 'caseCount'], 10000],
                            CasesNumberColors['10K'],
                            ['<', ['feature-state', 'caseCount'], 100000],
                            CasesNumberColors['100K'],
                            ['<', ['feature-state', 'caseCount'], 500000],
                            CasesNumberColors['500K'],
                            ['<', ['feature-state', 'caseCount'], 2000000],
                            CasesNumberColors['2M'],
                            ['<', ['feature-state', 'caseCount'], 10000000],
                            CasesNumberColors['10M'],
                            ['>=', ['feature-state', 'caseCount'], 10000000],
                            CasesNumberColors['10M+'],
                            CasesNumberColors.Fallback,
                        ],
                        CasesNumberColors.Fallback,
                    ],
                    'fill-outline-color': CasesNumberColors.Outline,
                },
            },
            'waterway-label',
        );
    }, [isLoading, mapLoaded]);

    return (
        <>
            {/* @TODO: add error popup once MUI is configured */}
            {error && <h1>{error}</h1>}
            {/* @TODO: add loading indicator once MUI is configured */}
            {(isLoading || !mapLoaded) && <h1>Loading...</h1>}
            <MapContainer
                ref={mapContainer}
                isLoading={isLoading || !mapLoaded}
            />
        </>
    );
};

export default CountryView;
