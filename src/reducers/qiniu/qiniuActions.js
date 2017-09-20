import Backend from '../../backend/Backend';
import appAuthToken from '../../backend/appAuthToken';

const {
  REQUEST_QINIU_TOKEN,
  REQUEST_QINIU_TOKEN_SUCCESS,
  REQUEST_QINIU_TOKEN_FAILURE,
} = require('../constants').default;

export function requestQiniuTokenRequest(scene) {
  return {
    type: REQUEST_QINIU_TOKEN,
    payload: scene,
  };
}

export function requestQiniuTokenSuccess(json) {
  return {
    type: REQUEST_QINIU_TOKEN_SUCCESS,
    payload: json,
  };
}

export function requestQiniuTokenFailure(error) {
  return {
    type: REQUEST_QINIU_TOKEN_FAILURE,
    payload: error,
  };
}

export function requestQiniuToken(scene) {
  return (dispatch) => {
    dispatch(requestQiniuTokenRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).getQiniuToken({ scene }),
      )
      .then((json) => {
        dispatch(requestQiniuTokenSuccess(json));
      })
      .catch((error) => {
        dispatch(requestQiniuTokenFailure(error));
      });
  };
}
