import { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl, { MapSourceDataEvent, EventData } from 'mapbox-gl';
import { useMapboxMap } from 'hooks/useMapboxMap';
import { MapContainer } from 'theme/globalStyles';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import {
    selectCountriesData,
    selectIsLoading,
    selectSelectedCountryInSideBar,
    selectFreshnessData,
    selectFreshnessLoading,
    selectPopupData,
} from 'redux/App/selectors';
import { setSelectedCountryInSidebar, setPopup } from 'redux/App/slice';
import {
    selectCompletenessData,
    selectChosenCompletenessField,
    selectIsLoading as selectCoverageViewLoading,
} from 'redux/CoverageView/selectors';
import { fetchCompletenessData } from 'redux/CoverageView/thunks';
import Loader from 'components/Loader';
import {
    getCoveragePercentage,
    getCountryName,
    getAdjustedLat,
    getAdjustedLng,
} from 'utils/helperFunctions';
import countryLookupTable from 'data/admin0-lookup-table.json';
import { CoverageViewColors } from 'models/Colors';
import MapPopup from 'components/MapPopup';
import { LegendRow } from 'models/LegendRow';
import Legend from 'components/Legend';

import { PopupContentText, BorderLinearProgress } from './styled';

const dataLayers: LegendRow[] = [
    { label: '< 20%', color: CoverageViewColors['20%'] },
    { label: '20-40%', color: CoverageViewColors['40%'] },
    { label: '40-60%', color: CoverageViewColors['60%'] },
    { label: '60-80%', color: CoverageViewColors['80%'] },
    { label: '> 80%', color: CoverageViewColors['>80%'] },
];

const CoverageView: React.FC = () => {
    const dispatch = useAppDispatch();
    const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';
    const dataPortalUrl = process.env.REACT_APP_DATA_PORTAL_URL;

    const countriesData = useAppSelector(selectCountriesData);
    const isLoading = useAppSelector(selectIsLoading);
    const selectedCountry = useAppSelector(selectSelectedCountryInSideBar);
    const isCoverageViewLoading = useAppSelector(selectCoverageViewLoading);
    const completenessData = useAppSelector(selectCompletenessData);
    const chosenCompletenessField = useAppSelector(
        selectChosenCompletenessField,
    );
    const freshnessData = useAppSelector(selectFreshnessData);
    const freshnessLoading = useAppSelector(selectFreshnessLoading);
    const popupData = useAppSelector(selectPopupData);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [featureIds, setFeatureIds] = useState<number[]>([]);
    const [currentPopup, setCurrentPopup] = useState<mapboxgl.Popup>();

    const chosenCompletenessFieldRef = useRef('cases');
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useMapboxMap(mapboxAccessToken, mapContainer);

    const lookupTableData = countryLookupTable.adm0.data.all as {
        [key: string]: any;
    };

    useEffect(() => {
        dispatch(fetchCompletenessData());
    }, []);

    // Fly to country
    useEffect(() => {
        if (!selectedCountry) return;

        const bounds = lookupTableData[selectedCountry.code].bounds;
        map.current?.fitBounds(bounds);
    }, [selectedCountry]);

    // Setup map
    useEffect(() => {
        const mapRef = map.current;
        if (!mapRef || isLoading || freshnessLoading) return;

        mapRef.on('load', () => {
            if (mapRef.getSource('countriesData')) {
                mapRef.removeSource('countriesData');
            }

            mapRef.addSource('countriesData', {
                type: 'vector',
                url: 'mapbox://mapbox.country-boundaries-v1',
            });

            // Setup map listener to check if map has loaded
            const setAfterSourceLoaded = (
                e: MapSourceDataEvent & EventData,
            ) => {
                if (e.sourceID !== 'countriesData' && !e.isSourceLoaded) return;
                setMapLoaded(true);
                displayCoverageData();
                mapRef.off('sourcedata', setAfterSourceLoaded);
            };

            if (mapRef.isSourceLoaded('countriesData')) {
                setMapLoaded(true);
                displayCoverageData();
            } else {
                mapRef.on('sourcedata', setAfterSourceLoaded);
            }
        });
    }, [isLoading, freshnessLoading]);

    // Display popup on the map
    useEffect(() => {
        const { isOpen, countryCode } = popupData;
        const mapRef = map.current;
        if (!isOpen || !countryCode || countryCode === '' || !mapRef) return;

        // Close previous popup if it exists
        if (currentPopup) currentPopup.remove();

        const country = countriesData.filter(
            (country) => country.code === countryCode,
        )[0];

        const caseCount = country.casecount;
        const totalCases = country.jhu;
        const coverage =
            chosenCompletenessField === 'cases'
                ? getCoveragePercentage(country)
                : Math.round(
                      completenessData[countryCode][
                          chosenCompletenessField
                      ] as number,
                  );
        const lastUploadDate = freshnessData[country.code] || 'unknown';
        const code = country.code;

        const lat =
            chosenCompletenessField === 'cases'
                ? getAdjustedLat(country.lat, country.code)
                : lookupTableData[countryCode].centroid[1];
        const lng =
            chosenCompletenessField === 'cases'
                ? getAdjustedLng(country.long, country.code)
                : lookupTableData[countryCode].centroid[0];
        const coordinates: mapboxgl.LngLatLike = { lng, lat };

        const searchQuery = `cases?country=${code}`;
        const url = `${dataPortalUrl}/${searchQuery}`;

        const countryName = getCountryName(code);

        const popupContent = (
            <>
                {chosenCompletenessFieldRef.current === 'cases' && (
                    <PopupContentText>
                        ({caseCount.toLocaleString()} out of{' '}
                        {totalCases.toLocaleString()})
                    </PopupContentText>
                )}

                <BorderLinearProgress variant="determinate" value={coverage} />
            </>
        );

        // This has to be done this way in order to allow for React components as a content of the popup
        const popupElement = document.createElement('div');
        ReactDOM.render(
            <MapPopup
                title={`${countryName} ${coverage}%`}
                content={popupContent}
                lastUploadDate={lastUploadDate}
                buttonText="Explore Country Data"
                buttonUrl={url}
            />,
            popupElement,
        );

        const popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setDOMContent(popupElement)
            .addTo(mapRef)
            .on('close', () =>
                dispatch(setPopup({ isOpen: false, countryCode: '' })),
            );

        setCurrentPopup(popup);
    }, [popupData]);

    const setMapState = () => {
        const mapRef = map.current;
        if (!mapRef) return;

        if (featureIds.length > 0) {
            for (const id of featureIds) {
                mapRef.removeFeatureState({
                    source: 'countriesData',
                    sourceLayer: 'country_boundaries',
                    id,
                });
            }
        }

        setTimeout(() => {
            const ids: number[] = [];
            if (chosenCompletenessField === 'cases') {
                for (const countryRow of countriesData) {
                    if (lookupTableData[countryRow.code]) {
                        const coverage = getCoveragePercentage(countryRow);

                        mapRef.setFeatureState(
                            {
                                source: 'countriesData',
                                sourceLayer: 'country_boundaries',
                                id: lookupTableData[countryRow.code].feature_id,
                            },
                            {
                                code: countryRow.code,
                                bounds: lookupTableData[countryRow.code].bounds,
                                coverage,
                            },
                        );

                        ids.push(lookupTableData[countryRow.code].feature_id);
                    }
                }
            } else {
                for (const countryCode of Object.keys(completenessData)) {
                    if (lookupTableData[countryCode]) {
                        const coverage = Math.round(
                            completenessData[countryCode][
                                chosenCompletenessField
                            ] as number,
                        );

                        mapRef.setFeatureState(
                            {
                                source: 'countriesData',
                                sourceLayer: 'country_boundaries',
                                id: lookupTableData[countryCode].feature_id,
                            },
                            {
                                code: countryCode,
                                bounds: lookupTableData[countryCode].bounds,
                                coverage,
                            },
                        );

                        ids.push(lookupTableData[countryCode].feature_id);
                    }
                }
            }

            setFeatureIds(ids);
        });
    };

    const mapClickListener = useCallback((e: any) => {
        const mapRef = map.current;
        if (!e.features || !e.features[0].state.code || !mapRef) return;

        const code = e.features[0].state.code;
        const countryName = getCountryName(code);

        dispatch(setSelectedCountryInSidebar({ _id: countryName, code }));
        dispatch(setPopup({ isOpen: true, countryCode: code }));
    }, []);

    const mouseEnterHandler = useCallback(() => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = 'pointer';
    }, []);

    const mouseLeaveHandler = useCallback(() => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
    }, []);

    // Display countries data on the map
    const displayCoverageData = () => {
        const mapRef = map.current;
        if (!countriesData || countriesData.length === 0 || !mapRef) return;

        setMapState();

        // This fixes console errors when hot reloading app
        if (mapRef.getLayer('countries-join')) {
            mapRef.off('click', 'countries-join', mapClickListener);
            mapRef.off('mouseenter', 'countries-join', mouseEnterHandler);
            mapRef.off('mouseleave', 'countries-join', mouseLeaveHandler);
            mapRef.removeLayer('countries-join');
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
                        ['!=', ['feature-state', 'coverage'], null],
                        [
                            'case',
                            ['<', ['feature-state', 'coverage'], 20],
                            CoverageViewColors['20%'],
                            ['<', ['feature-state', 'coverage'], 40],
                            CoverageViewColors['40%'],
                            ['<', ['feature-state', 'coverage'], 60],
                            CoverageViewColors['60%'],
                            ['<', ['feature-state', 'coverage'], 80],
                            CoverageViewColors['80%'],
                            ['>=', ['feature-state', 'coverage'], 80],
                            CoverageViewColors['>80%'],
                            CoverageViewColors.Fallback,
                        ],
                        CoverageViewColors.Fallback,
                    ],
                    'fill-outline-color': CoverageViewColors.Outline,
                },
            },
            'admin-1-boundary',
        );

        //Filter out countries without any data
        mapRef.setFilter('countries-join', [
            'in',
            'iso_3166_1',
            ...countriesData.map((country) => country.code),
        ]);

        // Change the mouse cursor to pointer when hovering above this layer
        mapRef.on('mouseenter', 'countries-join', mouseEnterHandler);

        // Change it back when it leaves.
        mapRef.on('mouseleave', 'countries-join', mouseLeaveHandler);

        mapRef.on('click', 'countries-join', mapClickListener);
    };

    // Update map whenever chosenCompletenessField changes
    useEffect(() => {
        if (!chosenCompletenessField || !mapLoaded) return;

        chosenCompletenessFieldRef.current = chosenCompletenessField;
        displayCoverageData();
    }, [chosenCompletenessField]);

    return (
        <>
            {(!mapLoaded || isCoverageViewLoading) && <Loader />}
            <MapContainer
                ref={mapContainer}
                isLoading={isLoading || !mapLoaded || isCoverageViewLoading}
            />
            <Legend title="Coverage" legendRows={dataLayers} />
        </>
    );
};

export default CoverageView;
