import { useRef, useEffect } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GlobalStyle } from 'theme/globalStyles';

import { MapContainer } from './styled';

const App: React.FC = () => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<Map | null>(null);

    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current || '',
            style: process.env.REACT_APP_MAP_THEME_URL,
            renderWorldCopies: false,
            center: [0, 40],
            zoom: 2.5,
            minZoom: 2,
        }).addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        map.current.on('load', () => {
            const mapRef = map.current;
            if (!mapRef) return;

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
        <div>
            <GlobalStyle />

            <MapContainer ref={mapContainer} />
        </div>
    );
};

export default App;
