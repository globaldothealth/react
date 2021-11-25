import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 62.5%;
  }
  
  body {
    margin: 0;    
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 1.6rem;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

interface MapContainerProps {
    isLoading: boolean;
}

export const MapContainer = styled.div<MapContainerProps>`
    width: 100vw;
    height: 100vh;
    transition: opacity 0.5s ease-in-out;

    opacity: ${(props) => (props.isLoading ? '0' : '1')};
`;
