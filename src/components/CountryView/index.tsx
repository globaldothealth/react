import { useRef, useEffect } from 'react';
import { useMapboxMap } from 'hooks/useMapboxMap';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import * as countryViewSelectors from 'redux/CountryView/selectors';
import { fetchCountriesData } from 'redux/CountryView/thunks';

import { MapContainer } from 'theme/globalStyles';

const CountryView: React.FC = () => {
    const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(countryViewSelectors.selectIsLoading);
    const error = useAppSelector(countryViewSelectors.selectError);
    const countriesData = useAppSelector(
        countryViewSelectors.selectCountriesData,
    );

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useMapboxMap(mapboxAccessToken, mapContainer);

    // Setup map
    useEffect(() => {
        const mapRef = map.current;
        if (!mapRef) return;

        mapRef.on('load', () => {
            mapRef.addSource('countriesData', {
                type: 'vector',
                url: 'mapbox://mapbox.country-boundaries-v1',
            });

            mapRef.addLayer(
                {
                    id: 'countries',
                    source: 'countriesData',
                    'source-layer': 'country_boundaries',
                    type: 'fill',
                    paint: {
                        'fill-color': '#88d0eb',
                        'fill-outline-color': '#007AEC',
                    },
                },
                'country-label',
            );
        });
    }, []);

    // Fetch countries data
    useEffect(() => {
        dispatch(fetchCountriesData());
    }, []);

    console.log(countriesData);

    return (
        <>
            {error && <h1>{error}</h1>}
            {isLoading && <h1>Loading...</h1>}
            <MapContainer ref={mapContainer} />
        </>
    );
};

export default CountryView;
