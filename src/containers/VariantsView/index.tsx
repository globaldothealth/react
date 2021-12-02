import { useEffect, useRef, useState } from 'react';
import { useMapboxMap } from 'hooks/useMapboxMap';
import { MapSourceDataEvent, EventData } from 'mapbox-gl';
import { fetchVariantsData } from 'redux/VariantsView/thunks';
import {
    selectVariantsData,
    selectChosenVariant,
} from 'redux/VariantsView/selectors';
import { selectIsLoading } from 'redux/App/selectors';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { sortData, sortStatesData } from 'utils/helperFunctions';
import { VariantsFillColors, VariantsOutlineColors } from 'models/Colors';

import { MapContainer } from 'theme/globalStyles';

// Layers to be displayed on map
const layers = [
    {
        id: 'checked-has-data',
        color: VariantsFillColors.CheckedHasData,
        outline: VariantsOutlineColors.CheckedHasData,
        label: 'Reporting',
    },
    {
        id: 'checked-no-data',
        color: VariantsFillColors.CheckedNoData,
        outline: VariantsOutlineColors.CheckedNoData,
        label: 'Not reporting',
    },
    {
        id: 'not-checked',
        color: VariantsFillColors.NotChecked,
        outline: VariantsOutlineColors.NotChecked,
        label: 'To be determined',
    },
];

const ANIMATION_DURATION = 500; // map animation duration in ms

const VariantsView: React.FC = () => {
    const dispatch = useAppDispatch();
    const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

    const [mapLoaded, setMapLoaded] = useState(false);
    const variantsData = useAppSelector(selectVariantsData);
    const isLoading = useAppSelector(selectIsLoading);
    const chosenVariant = useAppSelector(selectChosenVariant);

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useMapboxMap(mapboxAccessToken, mapContainer);

    // Fetch variants data
    useEffect(() => {
        dispatch(fetchVariantsData());
    }, []);

    // Setup map
    useEffect(() => {
        const mapRef = map.current;
        if (!mapRef || isLoading || !variantsData || variantsData.length === 0)
            return;

        mapRef.on('load', () => {
            if (!mapRef.getSource('countriesData')) {
                mapRef.addSource('countriesData', {
                    type: 'vector',
                    url: 'mapbox://mapbox.country-boundaries-v1',
                });
            }
            if (!mapRef.getSource('statesData')) {
                mapRef.addSource('statesData', {
                    type: 'geojson',
                    data: 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson',
                });
            }

            // Add layers to the map
            layers.forEach((layer) => {
                // Layer for countries
                if (!mapRef.getLayer(layer.id)) {
                    mapRef.addLayer(
                        {
                            id: layer.id,
                            source: 'countriesData',
                            'source-layer': 'country_boundaries',
                            type: 'fill',
                            paint: {
                                'fill-color': layer.color,
                                'fill-outline-color': layer.outline,
                                'fill-opacity': 0,
                                'fill-opacity-transition': {
                                    duration: ANIMATION_DURATION,
                                },
                            },
                        },
                        'country-label',
                    );
                }

                if (!mapRef.getLayer(`statesData-${layer.id}`)) {
                    // Layer for US statesData
                    mapRef.addLayer(
                        {
                            id: `statesData-${layer.id}`,
                            source: 'statesData',
                            type: 'fill',
                            paint: {
                                'fill-color': layer.color,
                                'fill-outline-color': layer.outline,
                                'fill-opacity': 0,
                                'fill-opacity-transition': {
                                    duration: ANIMATION_DURATION,
                                },
                            },
                        },
                        'waterway-label',
                    );
                }

                // Change cursor to pointer when hovering above countries
                mapRef.on('mouseenter', layer.id, () => {
                    mapRef.getCanvas().style.cursor = 'pointer';
                });

                mapRef.on('mouseleave', layer.id, () => {
                    mapRef.getCanvas().style.cursor = '';
                });

                // Change cursor to pointer when hovering above US statesData
                mapRef.on('mouseenter', `statesData-${layer.id}`, () => {
                    mapRef.getCanvas().style.cursor = 'pointer';
                });

                mapRef.on('mouseleave', `statesData-${layer.id}`, () => {
                    mapRef.getCanvas().style.cursor = '';
                });
            });

            // Setup map listener to check if map has loaded
            const setAfterSourceLoaded = (
                e: MapSourceDataEvent & EventData,
            ) => {
                if (e.sourceID !== 'statesData' && !e.isSourceLoaded) return;
                setMapLoaded(true);
                mapRef.off('sourcedata', setAfterSourceLoaded);
            };

            if (
                mapRef.isSourceLoaded('countriesData') &&
                mapRef.isSourceLoaded('statesData')
            ) {
                setMapLoaded(true);
            } else {
                mapRef.on('sourcedata', setAfterSourceLoaded);
            }
        });
    }, [isLoading, variantsData]);

    // Display countries and statesData on the map
    useEffect(() => {
        const mapRef = map.current;
        if (!variantsData || !mapRef || !mapLoaded) return;

        const { countriesWithData, countriesWithoutData, countriesNotChecked } =
            sortData(variantsData, chosenVariant);

        const { statesWithData, statesWithoutData, statesNotChecked } =
            sortStatesData(variantsData, chosenVariant);

        setLayersOpacity(0);

        setTimeout(() => {
            mapRef.setFilter('checked-has-data', [
                'in',
                'iso_3166_1_alpha_3',
                ...countriesWithData,
            ]);

            mapRef.setFilter('checked-no-data', [
                'in',
                'iso_3166_1_alpha_3',
                ...countriesWithoutData,
            ]);

            mapRef.setFilter('not-checked', [
                'in',
                'iso_3166_1_alpha_3',
                ...countriesNotChecked,
            ]);

            mapRef.setFilter('statesData-checked-has-data', [
                'in',
                'STATE_ID',
                ...statesWithData,
            ]);

            mapRef.setFilter('statesData-checked-no-data', [
                'in',
                'STATE_ID',
                ...statesWithoutData,
            ]);

            mapRef.setFilter('statesData-not-checked', [
                'in',
                'STATE_ID',
                ...statesNotChecked,
            ]);

            setLayersOpacity(1);
        }, ANIMATION_DURATION);
    }, [variantsData, mapLoaded, chosenVariant]);

    const setLayersOpacity = (opacity: number) => {
        layers.forEach((layer) => {
            map.current?.setPaintProperty(layer.id, 'fill-opacity', opacity);
            map.current?.setPaintProperty(
                `statesData-${layer.id}`,
                'fill-opacity',
                opacity,
            );
        });
    };

    return (
        <MapContainer ref={mapContainer} isLoading={isLoading || !mapLoaded} />
    );
};

export default VariantsView;
