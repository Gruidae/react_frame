import InitialState from './qiniuInitialState';

const {
  REQUEST_QINIU_TOKEN,
  REQUEST_QINIU_TOKEN_SUCCESS,
  REQUEST_QINIU_TOKEN_FAILURE,
} = require('../constants').default;

const initialState = new InitialState();

export default function qiniuReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }
  switch (action.type) {
    case REQUEST_QINIU_TOKEN:
      return state.set('isFetching', true).set('exception', null);
    case REQUEST_QINIU_TOKEN_SUCCESS:
      return state.set('isFetching', false).set('token', action.payload.up_token);
    case REQUEST_QINIU_TOKEN_FAILURE:
      return state.set('isFetching', false).set('exception', action.payload);
    default:
      break;
  }
  return state;
}
