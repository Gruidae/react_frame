import InitialState from './globalInitialState';

const {
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SESSION_TOKEN_SUCCESS,
  LOGOUT_SUCCESS,
  BIND_THIRD_ACCOUNT_SUCCESS,
  BIND_THIRD_ACCOUNT_FAILURE,

  GET_PROFILE_SUCCESS,
  PERFECT_SUCCESS,

  CHANGE_NICKNAME_SUCCESS,
  CHANGE_MOBILE_SUCCESS,
  CHANGE_COMPANY_SUCCESS,
  CHANGE_SWITCH_SUCCESS,

  GET_STATE,
  SET_STATE,
  SET_STORE,
} = require('../constants').default;

const initialState = new InitialState();

export default function globalReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }

  switch (action.type) {
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
      return state.set('currentUser', {
        sessionToken: action.payload.__vuser,
        ...action.payload,
      });

    case BIND_THIRD_ACCOUNT_SUCCESS: {
      const currentUser = {
        sessionToken: action.payload.__vuser,
        ...state.currentUser,
        ...action.payload,
      };
      if (!currentUser.has_binded_third) {
        currentUser.has_binded_third = {};
      }
      currentUser.has_binded_third[action.payload.platform] = 1;
      return state.set('currentUser', currentUser);
    }

    case GET_PROFILE_SUCCESS:
      return state.set('currentUser', { ...state.currentUser, ...action.payload.user_info });

    case PERFECT_SUCCESS:
      return state.set('currentUser', { ...state.currentUser, ...action.payload });

    case SESSION_TOKEN_SUCCESS:
      return state.set('currentUser', action.payload);

    case LOGOUT_SUCCESS:
      return state.set('currentUser', null);

    case SIGNUP_FAILURE:
    case LOGIN_FAILURE:
    case BIND_THIRD_ACCOUNT_FAILURE: {
      // 登录时返回异常，也可能是邮箱未激活造成，此时服务端的响应中仍然含有用户信息
      const currentUser = action.payload.data || null;
      return state.set('currentUser', currentUser);
    }

    case CHANGE_NICKNAME_SUCCESS:
    case CHANGE_MOBILE_SUCCESS:
    case CHANGE_COMPANY_SUCCESS:
      return state.set('currentUser', { ...state.currentUser, ...action.payload });

    case CHANGE_SWITCH_SUCCESS: {
      const settings = state.currentUser.settings || {};
      const currentUser = {
        ...state.currentUser,
        settings: {
          ...settings,
          ...action.payload,
        },
      };
      return state.set('currentUser', currentUser);
    }

    case SET_STORE:
      return state.set('store', action.payload);

    case GET_STATE: {
      const _state = state.store.getState();
      if (action.payload) {
        const newState = {};
        newState.bloc = _state.bloc.toJS();
        newState.global = _state.global.set('currentState', null).set('store', null).toJS();
        return state.set('showState', action.payload).set('currentState', newState);
      }
      return state.set('showState', action.payload);
    }

    case SET_STATE: {
      const global = JSON.parse(action.payload).global;
      return state.set('currentUser', global.currentUser)
        .set('showState', false)
        .set('currentState', null);
    }

    default:
      break;
  }

  return state;
}
