import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import detector from 'detector';

import reducer from './reducers';
import CONFIG from './config';

import errorHandler from './utils/errorHandler';

import GlobalInitialState from './reducers/global/globalInitialState';
import DeviceInitialState from './reducers/device/deviceInitialState';
import ProfileInitialState from './reducers/profile/profileInitialState';
import CommentInitialState from './reducers/comment/commentInitialState';
import { setPlatform, setVersion } from './reducers/device/deviceActions';
import { getSessionToken } from './reducers/auth/authActions';
import { setStore } from './reducers/global/globalActions';

const middlewares = [thunk, routerMiddleware(browserHistory)];

function getInitialState() {
  return {
    global: new GlobalInitialState(),
    device: new DeviceInitialState(),
    profile: new ProfileInitialState(),
    comment: new CommentInitialState(),
  };
}

// if (process.env.NODE_ENV === 'development') {
  /* eslint-disable global-require */
  // const createLogger = require('redux-logger');
  // const logger = createLogger();
  // middlewares.push(logger);
// }

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
const store = createStoreWithMiddleware(reducer, getInitialState(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

store.dispatch(setPlatform(
  {
    os: detector.os,
    device: detector.device,
    browser: detector.browser,
    engine: detector.engine,
    width: window.screen.availWidth ? window.screen.availWidth : window.screen.width,
    height: window.screen.availHeight ? window.screen.availHeight : window.screen.height,
  },
));
store.dispatch(setVersion(CONFIG.app.version));
store.dispatch(setStore(store));
store.dispatch(getSessionToken());
errorHandler.initStore(store);

export default store;
