import { replace } from 'react-router-redux';
import Backend from '../../backend/Backend';
import appAuthToken from '../../backend/appAuthToken';

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

  CHANGE_COMPANY_REQUEST,
  CHANGE_COMPANY_SUCCESS,
  CHANGE_COMPANY_FAILURE,

  CHANGE_MOBILE_REQUEST,
  CHANGE_MOBILE_SUCCESS,
  CHANGE_MOBILE_FAILURE,

  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,

  CHANGE_SWITCH_REQUEST,
  CHANGE_SWITCH_SUCCESS,
  CHANGE_SWITCH_FAILURE,
} = require('../constants').default;

export function getProfileRequest(uid) {
  return {
    type: GET_PROFILE_REQUEST,
    payload: uid,
  };
}

export function getProfileSuccess(json) {
  return {
    type: GET_PROFILE_SUCCESS,
    payload: json,
  };
}

export function getProfileFailure(json) {
  return {
    type: GET_PROFILE_FAILURE,
    payload: json,
  };
}

export function getProfile() {
  return (dispatch) => {
    dispatch(getProfileRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).nameCard(),
      )
      .then((json) => {
        dispatch(getProfileSuccess(json));
      })
      .catch((error) => {
        dispatch(getProfileFailure(error));
      });
  };
}

export function getNameCardRequest(uid) {
  return {
    type: GET_NAMECARD_REQUEST,
    uid,
  };
}

export function getNameCardSuccess(json, uid) {
  return {
    type: GET_NAMECARD_SUCCESS,
    payload: json,
    uid,
  };
}

export function getNameCardFailure(json, uid) {
  return {
    type: GET_NAMECARD_FAILURE,
    payload: json,
    uid,
  };
}

export function getNameCard(uid) {
  return (dispatch) => {
    dispatch(getNameCardRequest(uid));
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).nameCard({
          uid,
        }),
      )
      .then((json) => {
        dispatch(getNameCardSuccess(json, uid));
      })
      .catch((error) => {
        dispatch(getNameCardFailure(error, uid));
      });
  };
}

export function perfectRequest() {
  return {
    type: PERFECT_REQUEST,
  };
}

export function perfectSuccess(json) {
  return {
    type: PERFECT_SUCCESS,
    payload: json,
  };
}

export function perfectFailure(error) {
  return {
    type: PERFECT_FAILURE,
    payload: error,
  };
}

export function perfect(mobile, code, nickname, companyName, applyBid) {
  return (dispatch) => {
    dispatch(perfectRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).perfect({
          mobile,
          mobile_vcode: code,
          nickname,
          company_name: companyName,
          apply_bid: applyBid,
        }),
      )
      .then((json) => {
        dispatch(perfectSuccess(
          Object.assign({}, json, {
            mobile,
            nickname,
            companyName,
          }),
        ));
        dispatch(replace('/'));
      })
      .catch((error) => {
        dispatch(perfectFailure(error));
      });
  };
}

export function changeNicknameRequest() {
  return {
    type: CHANGE_NICKNAME_REQUEST,
  };
}

export function changeNicknameSuccess(json) {
  return {
    type: CHANGE_NICKNAME_SUCCESS,
    payload: json,
  };
}

export function changeNicknameFailure(error) {
  return {
    type: CHANGE_NICKNAME_FAILURE,
    payload: error,
  };
}

export function changeNickname(newNickname) {
  return (dispatch) => {
    dispatch(changeNicknameRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).changeNickname({
          nickname: newNickname,
        }),
      )
      .then((json) => {
        dispatch(changeNicknameSuccess(
          Object.assign({}, json, {
            nickname: newNickname,
          }),
        ));
      })
      .catch((error) => {
        dispatch(changeNicknameFailure(error));
      });
  };
}

export function changeCompanyRequest() {
  return {
    type: CHANGE_COMPANY_REQUEST,
  };
}

export function changeCompanySuccess(json) {
  return {
    type: CHANGE_COMPANY_SUCCESS,
    payload: json,
  };
}

export function changeCompanyFailure(error) {
  return {
    type: CHANGE_COMPANY_FAILURE,
    payload: error,
  };
}

export function changeCompany(newCompany) {
  return (dispatch) => {
    dispatch(changeCompanyRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).changeCompany({
          company_name: newCompany,
        }),
      )
      .then((json) => {
        dispatch(changeCompanySuccess(
          Object.assign({}, json, {
            company_name: newCompany,
          }),
        ));
      })
      .catch((error) => {
        dispatch(changeCompanyFailure(error));
      });
  };
}

export function changeMobileRequest() {
  return {
    type: CHANGE_MOBILE_REQUEST,
  };
}

export function changeMobileSuccess(json) {
  return {
    type: CHANGE_MOBILE_SUCCESS,
    payload: json,
  };
}

export function changeMobileFailure(error) {
  return {
    type: CHANGE_MOBILE_FAILURE,
    payload: error,
  };
}

export function changeMobile(mobile, vcode) {
  return (dispatch) => {
    dispatch(changeMobileRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).changeMobile({ mobile, vcode }),
      )
      .then((json) => {
        dispatch(changeMobileSuccess(
          Object.assign({}, json, { mobile }),
        ));
      })
      .catch((error) => {
        dispatch(changeMobileFailure(error));
      });
  };
}

export function changePasswordRequest() {
  return {
    type: CHANGE_PASSWORD_REQUEST,
  };
}

export function changePasswordSuccess() {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
  };
}

export function changePasswordFailure(error) {
  return {
    type: CHANGE_PASSWORD_FAILURE,
    payload: error,
  };
}

export function changePassword(oldPassword, newPassword) {
  return (dispatch) => {
    dispatch(changePasswordRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).changePassword({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      )
      .then(() => {
        dispatch(changePasswordSuccess());
      })
      .catch((error) => {
        dispatch(changePasswordFailure(error));
      });
  };
}

export function changeSwitch(switchType, switchValue) {
  return (dispatch) => {
    dispatch({
      type: CHANGE_SWITCH_REQUEST,
    });
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).changeSwitch({
          switch_type: switchType,
          switch_value: switchValue,
        }),
      )
      .then(() => {
        const json = {};
        json[switchType] = switchValue;
        dispatch({
          type: CHANGE_SWITCH_SUCCESS,
          payload: json,
        });
      })
      .catch((error) => {
        dispatch({
          type: CHANGE_SWITCH_FAILURE,
          payload: error,
        });
      });
  };
}
