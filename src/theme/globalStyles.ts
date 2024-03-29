import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 62.5%;
  }
  
  body {
    margin: 0;    
    font-family: "Inter", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 1.6rem;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .mapboxgl-popup {
    z-index: 999;    
    max-width: 50rem !important;
  }

  @font-face {
    font-family: 'Mabry Pro';
    src: url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-regular-pro/mabry-regular-pro.ttf") format('truetype'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-regular-pro/mabry-regular-pro.eot?#iefix") format('embedded-opentype'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-regular-pro/mabry-regular-pro.woff2") format('woff2'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-regular-pro/mabry-regular-pro.woff") format('woff');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Mabry Pro';
    src: url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-bold-pro/mabry-bold-pro.ttf") format('truetype'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-bold-pro/mabry-bold-pro.eot?#iefix") format('embedded-opentype'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-bold-pro/mabry-bold-pro.woff2") format('woff2'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-bold-pro/mabry-bold-pro.woff") format('woff');
    font-weight: bold;
    font-style: normal;
  }

  @font-face {
    font-family: 'Mabry Pro';
    src: url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-light-pro/mabry-light-pro.ttf") format('truetype'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-light-pro/mabry-light-pro.eot?#iefix") format('embedded-opentype'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-light-pro/mabry-light-pro.woff2") format('woff2'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-light-pro/mabry-light-pro.woff") format('woff');
    font-weight: lighter;
    font-style: normal;
  }

  @font-face {
    font-family: 'Mabry Pro';
    src: url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-italic-pro/mabry-italic-pro.ttf") format('truetype'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-italic-pro/mabry-italic-pro.eot?#iefix") format('embedded-opentype'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-italic-pro/mabry-italic-pro.woff2") format('woff2'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-italic-pro/mabry-italic-pro.woff") format('woff');
    font-weight: normal;
    font-style: italic;
  }

  @font-face {
    font-family: 'Mabry Pro';
    src: url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-bold-italic-pro/mabry-bold-italic-pro.ttf") format('truetype'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-bold-italic-pro/mabry-bold-italic-pro.eot?#iefix") format('embedded-opentype'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-bold-italic-pro/mabry-bold-italic-pro.woff2") format('woff2'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-bold-italic-pro/mabry-bold-italic-pro.woff") format('woff');
    font-weight: bold;
    font-style: italic;
  }

  @font-face {
    font-family: 'Mabry Pro';
    src: url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-light-italic-pro/mabry-light-italic-pro.ttf") format('truetype'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-light-italic-pro/mabry-light-italic-pro.eot?#iefix") format('embedded-opentype'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-light-italic-pro/mabry-light-italic-pro.woff2") format('woff2'),
        url("https://covid-19-aggregates-eu.s3.eu-central-1.amazonaws.com/fonts/mabry-light-italic-pro/mabry-light-italic-pro.woff") format('woff');
    font-weight: lighter;
    font-style: italic;
  }
`;

interface MapContainerProps {
    isLoading: boolean;
}

export const MapContainer = styled.div<MapContainerProps>`
    position: absolute;
    top: 6.4rem;
    left: 0;
    width: 100vw;
    height: calc(100vh - 6.4rem);
    transition: opacity 0.5s ease-in-out;

    opacity: ${(props) => (props.isLoading ? '0' : '1')};
`;
