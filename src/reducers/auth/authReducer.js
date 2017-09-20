import InitialState from './authInitialState';

const {
  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,

  DELETE_TOKEN_REQUEST,
  DELETE_TOKEN_SUCCESS,

  LOGOUT,
  REGISTER,
  LOGIN,
  FORGOT_PASSWORD,

  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,

  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,

  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,

  SEND_CODE_REQUEST,
  SEND_CODE_SUCCESS,
  SEND_CODE_FAILURE,

  SEND_ACTIVATE_EMAIL_REQUEST,
  SEND_ACTIVATE_EMAIL_SUCCESS,
  SEND_ACTIVATE_EMAIL_FAILURE,
} = require('../constants').default;

const initialState = new InitialState();

export default function authReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }

  switch (action.type) {
    case SESSION_TOKEN_REQUEST:
    case SIGNUP_REQUEST:
    case LOGOUT_REQUEST:
    case LOGIN_REQUEST:
    case RESET_PASSWORD_REQUEST:
    case SEND_ACTIVATE_EMAIL_REQUEST:
      return state.set('isFetching', true)
        .set('exception', null)
        .set('counter', 0);

    case SEND_CODE_REQUEST:
      return state.set('isFetching', true)
        .set('exception', null)
        .set('sessId', '')
        .set('captUrl', '')
        .set('counter', 0);

    /**
     * ### Logout state
     * The logged in user logs out
     */
    case LOGOUT:
      return state.set('state', action.type)
        .set('exception', null);

    /**
     * ### Login state
     * The user isn't logged in, and needs to
     * login, register or reset password
     */
    case LOGIN:
    case REGISTER:
    case FORGOT_PASSWORD:
      return state.set('state', action.type)
        .set('exception', null);

    /**
     * ### Requests end, good or bad
     * Set the fetching flag so the forms will be enabled
     */
    case SESSION_TOKEN_SUCCESS:
    case SESSION_TOKEN_FAILURE:
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
    case LOGOUT_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
    case SEND_ACTIVATE_EMAIL_SUCCESS:
      return state.set('isFetching', false).set('exception', null);

    case SEND_CODE_SUCCESS:
      return state.set('isFetching', false)
        .set('sessId', action.payload.sess_id)
        .set('captUrl', action.payload.capt_url)
        .set('counter', action.payload.secs);

    case SIGNUP_FAILURE:
    case LOGOUT_FAILURE:
    case LOGIN_FAILURE:
    case RESET_PASSWORD_FAILURE:
    case SEND_ACTIVATE_EMAIL_FAILURE:
      return state.set('isFetching', false)
        .set('exception', action.payload)
        .set('counter', 0);

    case SEND_CODE_FAILURE:
      return state.set('isFetching', false)
        .set('exception', action.payload)
        .set('sessId', '')
        .set('captUrl', '')
        .set('counter', 0);

    case DELETE_TOKEN_REQUEST:
    case DELETE_TOKEN_SUCCESS:
      // no state change, just an ability to track action requests...
      return state;

    default:
      break;
  }
  return state;
}
