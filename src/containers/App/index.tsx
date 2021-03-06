import { useEffect } from 'react';
import TopBar from 'components/TopBar';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CountryView from 'containers/CountryView';
import { RegionalView } from 'containers/RegionalView';
import CoverageView from 'containers/CoverageView';
import SideBar from 'components/SideBar';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
    fetchCountriesData,
    fetchTotalCases,
    fetchFreshnessData,
    fetchAppVersion,
} from 'redux/App/thunks';
import { selectIsLoading, selectError } from 'redux/App/selectors';
import { selectIsLoading as selectVariantsViewLoading } from 'redux/VariantsView/selectors';
import { selectIsRegionalViewLoading } from 'redux/RegionalView/selectors';
import Loader from 'components/Loader';
import ErrorAlert from 'components/ErrorAlert';
import VariantsView from 'containers/VariantsView';
import ReactGA from 'react-ga4';
import { useCookieBanner } from 'hooks/useCookieBanner';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from 'components/ErrorFallback';

import { ErrorContainer } from './styled';
import PopupSmallScreens from 'components/PopupSmallScreens';

const App = () => {
    const env = process.env.NODE_ENV;
    const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID || '';

    useEffect(() => {
        if (env !== 'production' || gaTrackingId === '') return;

        ReactGA.initialize(gaTrackingId);
    }, [env, gaTrackingId]);

    // Init IUBENDA cookie banner
    const { initCookieBanner } = useCookieBanner();

    useEffect(() => {
        initCookieBanner();
    }, []);

    const location = useLocation();
    const dispatch = useAppDispatch();

    const isLoading = useAppSelector(selectIsLoading);
    const isVariantsViewLoading = useAppSelector(selectVariantsViewLoading);
    const isRegionalViewLoading = useAppSelector(selectIsRegionalViewLoading);
    const error = useAppSelector(selectError);

    useEffect(() => {
        dispatch(fetchCountriesData());
        dispatch(fetchTotalCases());
        dispatch(fetchFreshnessData());
        dispatch(fetchAppVersion());
    }, [dispatch]);

    // Track page views
    useEffect(() => {
        if (env !== 'production') return;

        ReactGA.send({ hitType: 'pageview', page: location.pathname });
    }, [env, location]);

    return (
        <div className="App">
            {(isLoading || isVariantsViewLoading || isRegionalViewLoading) && (
                <Loader />
            )}

            <TopBar />
            <PopupSmallScreens />

            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.reload()}
            >
                <SideBar />

                <Routes>
                    <Route
                        path="/"
                        element={<Navigate replace to="/country" />}
                    />
                    <Route path="/country" element={<CountryView />} />
                    <Route path="/region" element={<RegionalView />} />
                    <Route path="/coverage" element={<CoverageView />} />
                    <Route
                        path="/variant-reporting"
                        element={
                            env === 'development' ? (
                                <VariantsView />
                            ) : (
                                <Navigate replace to="/country" />
                            )
                        }
                    />
                </Routes>

                {error && (
                    <ErrorContainer>
                        <ErrorAlert errorMessage={error} />
                    </ErrorContainer>
                )}
            </ErrorBoundary>
        </div>
    );
};

export default App;
