import _ from 'underscore';
import { push } from 'react-router-redux';

import Console from '../../utils/Console';
import Backend from '../../backend/Backend';
import appAuthToken from '../../backend/appAuthToken';

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

export function logoutState() {
  return {
    type: LOGOUT,
  };
}
export function registerState() {
  return {
    type: REGISTER,
  };
}

export function loginState() {
  return {
    type: LOGIN,
  };
}

export function forgotPasswordState() {
  return {
    type: FORGOT_PASSWORD,
  };
}

export function logoutRequest() {
  return {
    type: LOGOUT_REQUEST,
  };
}

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

export function logoutFailure(error) {
  return {
    type: LOGOUT_FAILURE,
    payload: error,
  };
}

export function deleteTokenRequest() {
  return {
    type: DELETE_TOKEN_REQUEST,
  };
}

export function deleteTokenRequestSuccess() {
  return {
    type: DELETE_TOKEN_SUCCESS,
  };
}

export function deleteSessionToken() {
  return (dispatch) => {
    dispatch(deleteTokenRequest());
    return appAuthToken.deleteSessionToken()
      .then(() => {
        dispatch(deleteTokenRequestSuccess());
      });
  };
}

export function logout() {
  return (dispatch) => {
    dispatch(logoutRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).logout(),
      )
      .then(() => {
        dispatch(loginState());
        dispatch(logoutSuccess());
        dispatch(deleteSessionToken());
        dispatch(push('/login'));
      })
      .catch((error) => {
        dispatch(loginState());
        dispatch(deleteSessionToken());
        dispatch(logoutFailure(error));
      });
  };
}

export function sessionTokenRequest() {
  return {
    type: SESSION_TOKEN_REQUEST,
  };
}

export function sessionTokenRequestSuccess(token) {
  return {
    type: SESSION_TOKEN_SUCCESS,
    payload: token,
  };
}

export function sessionTokenRequestFailure(error) {
  return {
    type: SESSION_TOKEN_FAILURE,
    payload: _.isUndefined(error) ? null : error,
  };
}

/**
 * ## Token
 * If AppAuthToken has the sessionToken, the user is logged in
 * so set the state to logout.
 * Otherwise, the user will default to the login in screen.
 */
export function getSessionToken() {
  return (dispatch) => {
    dispatch(sessionTokenRequest());
    return appAuthToken.getSessionToken()
      .then((token) => {
        Console.log('getSessionToken: ', token);
        if (token) {
          dispatch(sessionTokenRequestSuccess(token));
          dispatch(logoutState());
        } else {
          Console.log('sessionTokenRequestFailure 1');
          dispatch(sessionTokenRequestFailure());
        }
      })
      .catch((error) => {
        Console.log('sessionTokenRequestFailure 2', error);
        dispatch(sessionTokenRequestFailure(error));
        dispatch(loginState());
        // Actions.InitialLoginForm()
      });
  };
}

export function saveSessionToken(json) {
  Console.log('saveSessionToken', json);
  if (json && json.__vuser) {
    return appAuthToken.storeSessionToken(json.__vuser);
  }
  return null;
}

export function signupRequest() {
  return {
    type: SIGNUP_REQUEST,
  };
}

export function signupSuccess(json) {
  return {
    type: SIGNUP_SUCCESS,
    payload: json,
  };
}

export function signupFailure(error) {
  return {
    type: SIGNUP_FAILURE,
    payload: error,
  };
}

export function signup(email, password, mobile, code, nickname, companyName, applyBid) {
  return (dispatch) => {
    dispatch(signupRequest());
    return Backend.getInstance().register({
      email,
      password,
      mobile,
      mobile_vcode: code,
      nickname,
      company_name: companyName,
      apply_bid: applyBid,
    })
      .then(json =>
        saveSessionToken(json).then(() => {
          dispatch(signupSuccess({
            ...json,
            email,
            mobile,
            nickname,
            companyName,
          }));
          dispatch(logoutState());
        }),
      )
      .catch((error) => {
        saveSessionToken(error.data);
        dispatch(signupFailure(error));
      });
  };
}

export function loginRequest() {
  return {
    type: LOGIN_REQUEST,
  };
}

export function loginSuccess(json) {
  return {
    type: LOGIN_SUCCESS,
    payload: json,
  };
}

export function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    payload: error,
  };
}

export function login(email, password) {
  return (dispatch) => {
    dispatch(loginRequest());
    return Backend.getInstance().login({
      email,
      password,
    })
      .then(json =>
        saveSessionToken(json)
          .then(() => {
            dispatch(loginSuccess(json));
            dispatch(logoutState());
          }),
      )
      .catch((error) => {
        saveSessionToken(error.data);
        dispatch(loginFailure(error));
      });
  };
}

export function resetPasswordRequest() {
  return {
    type: RESET_PASSWORD_REQUEST,
  };
}

export function resetPasswordSuccess() {
  return {
    type: RESET_PASSWORD_SUCCESS,
  };
}

export function resetPasswordFailure(error) {
  return {
    type: RESET_PASSWORD_FAILURE,
    payload: error,
  };
}

export function resetPassword(email) {
  return (dispatch) => {
    dispatch(resetPasswordRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).resetPassword({
          email,
        }),
      )
      .then(() => {
        dispatch(loginState());
        dispatch(resetPasswordSuccess());
        // Actions.Login()
      })
      .catch((error) => {
        dispatch(resetPasswordFailure(error));
      });
  };
}

export function sendCodeRequest() {
  return {
    type: SEND_CODE_REQUEST,
  };
}

export function sendCodeSuccess(json) {
  return {
    type: SEND_CODE_SUCCESS,
    payload: json,
  };
}

export function sendCodeFailure(error) {
  return {
    type: SEND_CODE_FAILURE,
    payload: error,
  };
}

export function sendCode(mobile, scene, captchaCode, sessionId) {
  return (dispatch) => {
    dispatch(sendCodeRequest());
    return Backend.getInstance()
      .sendCode({
        mobile,
        scene,
        capt_code: captchaCode,
        sess_id: sessionId,
      })
      .then((json) => {
        dispatch(sendCodeSuccess(json));
      })
      .catch((error) => {
        dispatch(sendCodeFailure(error));
      });
  };
}

export function sendActivateEmailRequest() {
  return {
    type: SEND_ACTIVATE_EMAIL_REQUEST,
  };
}

export function sendActivateEmailSuccess(json) {
  return {
    type: SEND_ACTIVATE_EMAIL_SUCCESS,
    payload: json,
  };
}

export function sendActivateEmailFailure(error) {
  return {
    type: SEND_ACTIVATE_EMAIL_FAILURE,
    payload: error,
  };
}

export function sendActivateEmail() {
  return (dispatch) => {
    dispatch(sendActivateEmailRequest());
    return Backend.getInstance()
      .sendActivateEmail()
      .then((json) => {
        dispatch(sendActivateEmailSuccess(json));
      })
      .catch((error) => {
        dispatch(sendActivateEmailFailure(error));
      });
  };
}
