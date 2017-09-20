import InitialState from './accountThirdInitialState';

const {
  GET_THIRD_LOGIN_REQUEST,
  GET_THIRD_LOGIN_SUCCESS,
  GET_THIRD_LOGIN_FAILURE,

  REDIRECT_OAUTH_REQUEST,
  REDIRECT_OAUTH_SUCCESS,
  REDIRECT_OAUTH_FAILURE,

  BIND_THIRD_ACCOUNT_REQUEST,
  BIND_THIRD_ACCOUNT_SUCCESS,
  BIND_THIRD_ACCOUNT_FAILURE,
} = require('../constants').default;

const initialState = new InitialState();

export default function accountThirdReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }

  switch (action.type) {

    case GET_THIRD_LOGIN_REQUEST:
    case REDIRECT_OAUTH_REQUEST:
    case BIND_THIRD_ACCOUNT_REQUEST:
      return state.set('isFetching', true);

    case GET_THIRD_LOGIN_SUCCESS:
      return state.set('isFetching', true)
        .set('exception', null);

    case REDIRECT_OAUTH_SUCCESS:
    case BIND_THIRD_ACCOUNT_SUCCESS:
      return state.set('isFetching', false)
        .set('exception', null);

    case GET_THIRD_LOGIN_FAILURE:
    case REDIRECT_OAUTH_FAILURE:
    case BIND_THIRD_ACCOUNT_FAILURE:
      return state.set('isFetching', false)
        .set('exception', action.payload);

    default:
      break;
  }

  return state;
}
