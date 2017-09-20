import { notification } from 'antd';
import Backend from '../../backend/Backend';
import appAuthToken from '../../backend/appAuthToken';

const {
  GET_APPLY_LIST_REQUEST,
  GET_APPLY_LIST_SUCCESS,
  GET_APPLY_LIST_FAILURE,

  PASS_BID_AUTH_REQUEST,
  PASS_BID_AUTH_SUCCESS,
  PASS_BID_AUTH_FAILURE,

  REJECT_BID_AUTH_REQUEST,
  REJECT_BID_AUTH_SUCCESS,
  REJECT_BID_AUTH_FAILURE,

  APPLY_BID_AUTH_REQUEST,
  APPLY_BID_AUTH_SUCCESS,
  APPLY_BID_AUTH_FAILURE,
} = require('../constants').default;

export function getApplyListRequest() {
  return {
    type: GET_APPLY_LIST_REQUEST,
  };
}

export function getApplyListSuccess(json) {
  return {
    type: GET_APPLY_LIST_SUCCESS,
    payload: json,
  };
}

export function getApplyListFailure(json) {
  return {
    type: GET_APPLY_LIST_FAILURE,
    payload: json,
  };
}

export function passBidAuthRequest() {
  return {
    type: PASS_BID_AUTH_REQUEST,
  };
}

export function passBidAuthSuccess(json) {
  return {
    type: PASS_BID_AUTH_SUCCESS,
    payload: json,
  };
}

export function passBidAuthFailure(json) {
  return {
    type: PASS_BID_AUTH_FAILURE,
    payload: json,
  };
}

export function rejectBidAuthRequest() {
  return {
    type: REJECT_BID_AUTH_REQUEST,
  };
}

export function rejectBidAuthSuccess(json) {
  return {
    type: REJECT_BID_AUTH_SUCCESS,
    payload: json,
  };
}

export function rejectBidAuthFailure(json) {
  return {
    type: REJECT_BID_AUTH_FAILURE,
    payload: json,
  };
}

export function applyBidAuthRequest() {
  return {
    type: APPLY_BID_AUTH_REQUEST,
  };
}

export function applyBidAuthSuccess(json) {
  return {
    type: APPLY_BID_AUTH_SUCCESS,
    payload: json,
  };
}

export function applyBidAuthFailure(json) {
  return {
    type: APPLY_BID_AUTH_FAILURE,
    payload: json,
  };
}

export function getApplyList(status, page) {
  return (dispatch) => {
    dispatch(getApplyListRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).getApplyList({
          status,
          page,
        }),
      )
      .then((json) => {
        dispatch(getApplyListSuccess(json));
      })
      .catch((error) => {
        dispatch(getApplyListFailure(error));
      });
  };
}

export function passBidAuth(applyId) {
  return (dispatch) => {
    dispatch(passBidAuthRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).passBidAuth({
          apply_id: applyId,
        }),
      )
      .then((json) => {
        dispatch(passBidAuthSuccess({ applyId, ...json }));
      })
      .catch((error) => {
        dispatch(passBidAuthFailure(error));
      });
  };
}

export function rejectBidAuth(applyId, reason) {
  return (dispatch) => {
    dispatch(rejectBidAuthRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).rejectBidAuth({
          apply_id: applyId,
          reason,
        }),
      )
      .then((json) => {
        dispatch(rejectBidAuthSuccess({ applyId, ...json }));
      })
      .catch((error) => {
        dispatch(rejectBidAuthFailure(error));
      });
  };
}

export function applyBidAuth() {
  return (dispatch) => {
    dispatch(applyBidAuthRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).applyBidAuth(),
      )
      .then((json) => {
        dispatch(applyBidAuthSuccess(json));
        notification.success({
          message: '投标权限',
          description: '申请已提交，请耐心等待，我们将在1-2个工作日内处理',
        });
      })
      .catch((error) => {
        dispatch(applyBidAuthFailure(error));
      });
  };
}
