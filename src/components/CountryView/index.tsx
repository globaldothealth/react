import { useRef, useEffect } from 'react';
import { useMapboxMap } from 'hooks/useMapboxMap';

import { MapContainer } from 'theme/globalStyles';

const CountryView: React.FC = () => {
    const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useMapboxMap(mapboxAccessToken, mapContainer);

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

    return (
        <>
            <MapContainer ref={mapContainer} />
        </>
    );
};

export default CountryView;
