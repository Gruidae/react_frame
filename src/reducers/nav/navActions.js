const {
  SET_DOCUMENT_TITLE,
} = require('../constants').default;

export function setDocumentTitle(title) {
  return {
    type: SET_DOCUMENT_TITLE,
    payload: title,
  };
}

export function setDocumentTitle2(title) {
  return {
    type: SET_DOCUMENT_TITLE,
    payload: title,
  };
}
