import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import reportWebVitals from 'reportWebVitals';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GlobalStyle } from 'theme/globalStyles';
import { store } from 'redux/store';
import { Provider } from 'react-redux';

ReactDOM.render(
    <StrictMode>
        <GlobalStyle />

        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
