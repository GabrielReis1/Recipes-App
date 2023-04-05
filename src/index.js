import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from './Contexts/ProviderData';
import App from './App';

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <div className="app">
      <Provider>
        <App />
      </Provider>
    </div>,
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
