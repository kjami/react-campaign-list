import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "react-datepicker/dist/react-datepicker.css";

//Separate reducers are used for abstraction
import campaignReducer from './store/reducers/campaigns';
import filterBarReducer from './store/reducers/filterBar';

//Combine reducers into one
//Provide namespaces for each reducer (like campaignsNS)
const reducer = combineReducers({
    campaignsNS: campaignReducer,
    filterBarNS: filterBarReducer
});

//Create redux global store
const store = createStore(reducer);

//Provide the redux global store to the root App element
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
