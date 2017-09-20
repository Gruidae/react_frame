const InitialState = require('./profileInitialState').default;
const {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  GET_NAMECARD_REQUEST,
  GET_NAMECARD_SUCCESS,
  GET_NAMECARD_FAILURE,

  PERFECT_REQUEST,
  PERFECT_SUCCESS,
  PERFECT_FAILURE,

  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  CHANGE_NICKNAME_FAILURE,

  CHANGE_MOBILE_REQUEST,
  CHANGE_MOBILE_SUCCESS,
  CHANGE_MOBILE_FAILURE,

  CHANGE_COMPANY_REQUEST,
  CHANGE_COMPANY_SUCCESS,
  CHANGE_COMPANY_FAILURE,

  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,

  CHANGE_SWITCH_REQUEST,
  CHANGE_SWITCH_SUCCESS,
  CHANGE_SWITCH_FAILURE,

  LOGOUT_SUCCESS,
  LOGIN_SUCCESS,

  SET_STATE,
} = require('../constants').default;

const initialState = new InitialState();

function nameCardReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }
  switch (action.type) {
    case GET_NAMECARD_REQUEST:
      return state.setIn(['profiles', action.uid, 'isFetching'], true);

    case GET_NAMECARD_SUCCESS:
      return state.setIn(['profiles', action.uid, 'isFetching'], false)
        .setIn(['profiles', action.uid, 'profile'], action.payload.user_info)
        .setIn(['profiles', action.uid, 'exception'], null);

    case GET_NAMECARD_FAILURE:
      return state.setIn(['profiles', action.uid, 'isFetching'], false)
        .setIn(['profiles', action.uid, 'profile'], null)
        .setIn(['profiles', action.uid, 'exception'], action.payload);

    case GET_PROFILE_REQUEST:
      return state.set('isFetching', true);

    case GET_PROFILE_SUCCESS:
      return state.set('isFetching', false)
        .set('profile', action.payload.user_info)
        .set('exception', null);

    case GET_PROFILE_FAILURE:
      return state.set('isFetching', false)
        .set('profile', null)
        .set('exception', action.payload);

    default:
      break;
  }
  return state;
}

export default function profileReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }

  switch (action.type) {

    case GET_PROFILE_REQUEST:
    case GET_PROFILE_SUCCESS:
    case GET_PROFILE_FAILURE:
    case GET_NAMECARD_REQUEST:
    case GET_NAMECARD_SUCCESS:
    case GET_NAMECARD_FAILURE:
      return nameCardReducer(state, action);

    case PERFECT_REQUEST:
    case CHANGE_NICKNAME_REQUEST:
    case CHANGE_MOBILE_REQUEST:
    case CHANGE_COMPANY_REQUEST:
    case CHANGE_PASSWORD_REQUEST:
    case CHANGE_SWITCH_REQUEST:
      return state.set('isFetching', true).set('exception', null);

    case PERFECT_SUCCESS:
    case CHANGE_NICKNAME_SUCCESS:
    case CHANGE_MOBILE_SUCCESS:
    case CHANGE_COMPANY_SUCCESS:
    case CHANGE_PASSWORD_SUCCESS:
    case CHANGE_SWITCH_SUCCESS:
      return state.set('isFetching', false).set('exception', null);

    case PERFECT_FAILURE:
    case CHANGE_NICKNAME_FAILURE:
    case CHANGE_MOBILE_FAILURE:
    case CHANGE_COMPANY_FAILURE:
    case CHANGE_PASSWORD_FAILURE:
    case CHANGE_SWITCH_FAILURE:
      return state.set('isFetching', false).set('exception', action.payload);

    case LOGIN_SUCCESS:
    case LOGOUT_SUCCESS:
      return state.set('isFetching', false).set('exception', null);

    case SET_STATE: {
      const profile = JSON.parse(action.payload).profile;
      return state
        .set('isFetching', profile.isFetching)
        .set('exception', profile.exception)
        .set('profile', profile.profile);
    }
    default:
      break;
  }
  return state;
}
