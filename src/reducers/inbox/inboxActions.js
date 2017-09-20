import Backend from '../../backend/Backend';
import appAuthToken from '../../backend/appAuthToken';

const {
  GET_MSG_LIST_REQUEST,
  GET_MSG_LIST_SUCCESS,
  GET_MSG_LIST_FAILURE,

  GET_NEW_MSG_COUNT_REQUEST,
  GET_NEW_MSG_COUNT_SUCCESS,
  GET_NEW_MSG_COUNT_FAILURE,

  CLEAR_NEW_MSG_COUNT_REQUEST,
  CLEAR_NEW_MSG_COUNT_SUCCESS,
  CLEAR_NEW_MSG_COUNT_FAILURE,
} = require('../constants').default;

export function getMsgListRequest() {
  return ({
    type: GET_MSG_LIST_REQUEST,
  });
}

export function getMsgListSuccess(json) {
  return ({
    type: GET_MSG_LIST_SUCCESS,
    payload: json,
  });
}

export function getMsgListFailure(json) {
  return ({
    type: GET_MSG_LIST_FAILURE,
    payload: json,
  });
}

export function getNewMsgCountRequest() {
  return ({
    type: GET_NEW_MSG_COUNT_REQUEST,
  });
}

export function getNewMsgCountSuccess(json) {
  return ({
    type: GET_NEW_MSG_COUNT_SUCCESS,
    payload: json,
  });
}

export function getNewMsgCountFailure(json) {
  return ({
    type: GET_NEW_MSG_COUNT_FAILURE,
    payload: json,
  });
}

export function clearNewMsgCountRequest() {
  return ({
    type: CLEAR_NEW_MSG_COUNT_REQUEST,
  });
}

export function clearNewMsgCountSuccess(json) {
  return ({
    type: CLEAR_NEW_MSG_COUNT_SUCCESS,
    payload: json,
  });
}

export function clearNewMsgCountFailure(json) {
  return ({
    type: CLEAR_NEW_MSG_COUNT_FAILURE,
    payload: json,
  });
}

export function getMsgList(type, page) {
  return (dispatch) => {
    dispatch(getMsgListRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).getMsgList({
          type,
          page,
        }),
      )
      .then((json) => {
        dispatch(getMsgListSuccess({ type, page, ...json }));
      })
      .catch((error) => {
        dispatch(getMsgListFailure(error));
      });
  };
}

export function getNewMsgCount() {
  return (dispatch) => {
    dispatch(getNewMsgCountRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).getNewMsgCount(),
      )
      .then((json) => {
        dispatch(getNewMsgCountSuccess(json));
      })
      .catch((error) => {
        dispatch(getNewMsgCountFailure(error));
      });
  };
}

export function clearNewMsgCount(type) {
  return (dispatch) => {
    dispatch(clearNewMsgCountRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).clearNewMsgCount({
          type,
        }),
      )
      .then((json) => {
        dispatch(clearNewMsgCountSuccess({ type, ...json }));
      })
      .catch((error) => {
        dispatch(clearNewMsgCountFailure(error));
      });
  };
}
