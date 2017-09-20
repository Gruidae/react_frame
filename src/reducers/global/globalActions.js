const {
  SET_STORE,
  SET_STATE,
  GET_STATE,
  HANDLE_EXCEPTION,
} = require('../constants').default;

export function setStore(store) {
  return {
    type: SET_STORE,
    payload: store,
  };
}

export function setState(newState) {
  return {
    type: SET_STATE,
    payload: newState,
  };
}

export function getState(toggle) {
  return {
    type: GET_STATE,
    payload: toggle,
  };
}

export function handleException(exception) {
  return {
    type: HANDLE_EXCEPTION,
    payload: exception,
  };
}
