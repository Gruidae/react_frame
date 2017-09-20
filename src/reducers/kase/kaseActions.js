import { replace } from 'react-router-redux';
import { notification } from 'antd';
import Backend from '../../backend/Backend';
import appAuthToken from '../../backend/appAuthToken';
import hmbKaseClient from '../../backend/hmbKaseClient';

const {
  GET_CASE_LIST_REQUEST,
  GET_CASE_LIST_SUCCESS,
  GET_CASE_LIST_FAILURE,

  GET_KASE_DETAIL_REQUEST,
  GET_KASE_DETAIL_SUCCESS,
  GET_KASE_DETAIL_FAILURE,

  CREATE_CASE_REQUEST,
  CREATE_CASE_SUCCESS,
  CREATE_CASE_FAILURE,

  MODIFY_CASE_REQUEST,
  MODIFY_CASE_SUCCESS,
  MODIFY_CASE_FAILURE,

  REJECT_CASE_REQUEST,
  REJECT_CASE_SUCCESS,
  REJECT_CASE_FAILURE,

} = require('../constants').default;

export const caseListType = {
  ALL_CASES: 0,
  MY_PUBLISHED_CASES: 1,
  MY_ACCEPTED_CASES: 2,
  DRAFT_CASES: 3,
};

// case list helper
function generateSelectedPage(listType, payload) {
  switch (listType) {
    case caseListType.ALL_CASES:
      return `all_${payload.page}_${payload.keyword}_${payload.sort_type}`;
    case caseListType.MY_PUBLISHED_CASES:
      return `myPublication_${payload.page}_${payload.keyword}_${payload.sort_type}`;
    case caseListType.MY_ACCEPTED_CASES:
      return `myAcceptance_${payload.page}_${payload.keyword}_${payload.sort_type}`;
    case caseListType.DRAFT_CASES:
      return `draft_${payload.page}_${payload.keyword}_${payload.sort_type}`;
    default:
      throw new Error('Unknown case list type');
  }
}

function requestFromListType(listType) {
  switch (listType) {
    case caseListType.ALL_CASES:
      return hmbKaseClient.getAllCases;
    case caseListType.MY_PUBLISHED_CASES:
      return hmbKaseClient.getMyPublishedCases;
    case caseListType.MY_ACCEPTED_CASES:
      return hmbKaseClient.getMyAcceptedCases;
    case caseListType.DRAFT_CASES:
      return hmbKaseClient.getDraftCases;
    default:
      throw new Error('Unknown case list type');
  }
}

function dispatchSubmitCaseRoute(dispatch, isSave) {
  if (isSave) {
    dispatch(replace('/case/draft'));
  } else {
    dispatch(replace('/home/published-cases'));
  }
}


export function getCaseListRequest(json) {
  return {
    type: GET_CASE_LIST_REQUEST,
    payload: json,
  };
}

export function getCaseListSuccess(json) {
  return {
    type: GET_CASE_LIST_SUCCESS,
    payload: json,
  };
}

export function getCaseListFailure(json) {
  return {
    type: GET_CASE_LIST_FAILURE,
    payload: json,
  };
}

export function getCaseList({ pageNumber = 1, keyword = '', sortType = 0, listType = caseListType.ALL_CASES }) {
  const payload = {
    page: pageNumber,
    keyword,
    sort_type: sortType,
  };
  const selectedPage = generateSelectedPage(listType, payload);

  return (dispatch) => {
    dispatch(getCaseListRequest({ ...payload, selectedPage }));
    return appAuthToken.getSessionToken()
      .then(token =>
        requestFromListType(listType).call(Backend.getInstance(token), payload),
      )
      .then(json =>
        dispatch(getCaseListSuccess({ ...json, selectedPage })),
      )
      .catch(error =>
        dispatch(getCaseListFailure({ ...error, selectedPage })),
      );
  };
}

export function getKaseDetailRequest(kaseSn) {
  return {
    type: GET_KASE_DETAIL_REQUEST,
    payload: kaseSn,
  };
}

export function getKaseDetailSuccess(json) {
  return {
    type: GET_KASE_DETAIL_SUCCESS,
    payload: json,
  };
}

export function getKaseDetailFailure(json) {
  return {
    type: GET_KASE_DETAIL_FAILURE,
    payload: json,
  };
}

export function getKaseDetail(kaseSn) {
  return (dispatch) => {
    dispatch(getKaseDetailRequest(kaseSn));
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).getKaseDetail({
          case_sn: kaseSn,
        }),
      )
      .then((json) => {
        dispatch(getKaseDetailSuccess(json));
      })
      .catch((error) => {
        dispatch(getKaseDetailFailure(error));
      });
  };
}


export function createKaseRequest() {
  return {
    type: CREATE_CASE_REQUEST,
  };
}

export function createKaseSuccess(json) {
  return {
    type: CREATE_CASE_SUCCESS,
    payload: json,
  };
}

export function createKaseFailure(json) {
  return {
    type: CREATE_CASE_FAILURE,
    payload: json,
  };
}

export function createKase(params, isSave) {
  return (dispatch) => {
    dispatch(createKaseRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).createKase(params),
      )
      .then((json) => {
        dispatch(createKaseSuccess(json));
        dispatchSubmitCaseRoute(dispatch, isSave);
      })
      .catch((error) => {
        dispatch(createKaseFailure(error));
      });
  };
}

export function modifyKaseRequest() {
  return {
    type: MODIFY_CASE_REQUEST,
  };
}

export function modifyKaseSuccess(json) {
  return {
    type: MODIFY_CASE_SUCCESS,
    payload: json,
  };
}

export function modifyKaseFailure(json) {
  return {
    type: MODIFY_CASE_FAILURE,
    payload: json,
  };
}

export function modifyKase(params, isSave) {
  return (dispatch) => {
    dispatch(modifyKaseRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).modifyKase(params),
      )
      .then((json) => {
        dispatch(modifyKaseSuccess(json));
        dispatchSubmitCaseRoute(dispatch, isSave);
      })
      .catch((error) => {
        dispatch(modifyKaseFailure(error));
      });
  };
}

export function rejectKaseRequest() {
  return {
    type: REJECT_CASE_REQUEST,
  };
}

export function rejectKaseSuccess(json) {
  return {
    type: REJECT_CASE_SUCCESS,
    payload: json,
  };
}

export function rejectKaseFailure(json) {
  return {
    type: REJECT_CASE_FAILURE,
    payload: json,
  };
}

export function rejectKase(kaseSn) {
  return (dispatch) => {
    dispatch(rejectKaseRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).rejectKase({ case_sn: kaseSn }),
      )
      .then((json) => {
        dispatch(rejectKaseSuccess(json));
        notification.success({
          message: '驳回案例',
          description: '驳回案例成功',
        });
        dispatch(getKaseDetail(kaseSn));
      })
      .catch((error) => {
        dispatch(rejectKaseFailure(error));
      });
  };
}

