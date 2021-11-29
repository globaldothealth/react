import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import reportWebVitals from 'reportWebVitals';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GlobalStyle } from 'theme/globalStyles';
import { store } from 'redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
    <StrictMode>        
        <Provider store={store}>
        <Router>
        <GlobalStyle />
            <Reset />
            <Normalize />        
            <App />
            <BrowserRouter />
        </Provider>
    </StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
