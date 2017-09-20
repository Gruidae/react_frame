import Backend from '../../backend/Backend';
import appAuthToken from '../../backend/appAuthToken';
import { loginSuccess, logoutState, saveSessionToken } from '../auth/authActions';

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

export function getThirdLoginUrl(source) {
  return (dispatch) => {
    dispatch({
      type: GET_THIRD_LOGIN_REQUEST,
    });
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).getThirdLoginUrl({ source }),
      )
      .then((data) => {
        window.location.href = data.url;
        dispatch({
          type: GET_THIRD_LOGIN_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_THIRD_LOGIN_FAILURE,
          payload: error,
        });
      });
  };
}

export function redirectOAuth(source, params) {
  return (dispatch) => {
    dispatch({
      type: REDIRECT_OAUTH_REQUEST,
    });
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).redirectOAuth({
          source,
          ...params,
        }),
      )
      .then((data) => {
        saveSessionToken(data).then(() => {
          if (data.__vuser) {
            dispatch(loginSuccess(data));
            dispatch(logoutState());
          } else {
            dispatch({
              type: REDIRECT_OAUTH_SUCCESS,
              payload: data,
            });
          }
        });
      })
      .catch((error) => {
        dispatch({
          type: REDIRECT_OAUTH_FAILURE,
          payload: error,
        });
      });
  };
}

export function bindThirdAccount(email, password, sessionId) {
  return (dispatch) => {
    dispatch({
      type: BIND_THIRD_ACCOUNT_REQUEST,
    });
    return Backend.getInstance().bindThirdAccount({
      email,
      password,
      sess_id: sessionId,
    })
    .then(data =>
      saveSessionToken(data).then(() => {
        dispatch({
          type: BIND_THIRD_ACCOUNT_SUCCESS,
          payload: {
            ...data,
            email,
          },
        });
        dispatch(logoutState());
      }),
    )
    .catch((error) => {
      saveSessionToken(error.data);
      dispatch({
        type: BIND_THIRD_ACCOUNT_FAILURE,
        payload: error,
      });
    });
  };
}
