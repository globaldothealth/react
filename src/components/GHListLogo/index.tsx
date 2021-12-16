import logo from 'assets/images/gh_logo.svg';
import { useState } from 'react';
import { LogoStyles, LogoImage, MapGuideButton } from './styled';
import MapGuide from './MapGuide';

export default function GHListLogo(): JSX.Element {
    const [showMapGuide, setShopwMapGuide] = useState(false);

    const handleShowMapGuide = () => {
        setShopwMapGuide((p) => !p);
    };

    return (
        <LogoStyles id="logo">
            <a href="https://global.health/">
                <div id="logo-container">
                    <LogoImage src={logo} />
                    <span className="logoText">Map</span>
                </div>
            </a>
            <MapGuideButton
                id="helpGuide"
                className="navlink navlink-question-mark"
            >
                <button
                    className="help-guide-button MuiButton-textPrimary"
                    onClick={handleShowMapGuide}
                >
                    <svg
                        className="MuiSvgIcon-root"
                        focusable="false"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>
                    </svg>
                    <span className="map-guide-text">Map Guide</span>
                </button>
            </MapGuideButton>
            {showMapGuide ? (
                <MapGuide
                    showMapGuide={showMapGuide}
                />
            ) : null}
        </LogoStyles>
    );
}
