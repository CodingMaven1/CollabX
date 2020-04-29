import {createStore, applyMiddleware} from 'redux';
import {logger} from 'redux-logger';
import reduxThunk from 'redux-thunk';
import rootreducer from './root-reducer';

const middleware = [logger, reduxThunk];

const store = createStore(rootreducer, applyMiddleware(...middleware));

export default store;