import InitialState from './deviceInitialState';

const {
  SET_PLATFORM,
  SET_VERSION,
} = require('../constants').default;

const initialState = new InitialState();

const mobileOsList = ['ios', 'android', 'yunos', 'wp', 'symbian', 'blackberry'];

const isMobile = (os, width) => {
  let mobile = false;
  mobile = mobile || mobileOsList.includes(os);
  if (width) {
    mobile = mobile && width < 768;
  }
  return mobile;
};

const isWechat = name => name === 'micromessenger';

export default function deviceReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.merge(state);
  }
  switch (action.type) {
    case SET_PLATFORM:
      return state.set('platform', action.payload)
        .set('isMobile', isMobile(action.payload.os.name, action.payload.width))
        .set('isWechat', isWechat(action.payload.browser.name))
        .set('isIos', action.payload.os.name === 'ios');
    case SET_VERSION:
      return state.set('version', action.payload);
    default:
      break;
  }
  return state;
}
