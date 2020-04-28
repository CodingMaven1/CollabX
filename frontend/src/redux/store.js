import {createStore, applyMiddleware} from 'redux';
import {logger} from 'redux-logger';

import rootreducer from './root-reducer';

const middleware = [logger];

const store = createStore(rootreducer, applyMiddleware(...middleware));

export default store;