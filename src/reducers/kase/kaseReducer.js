import { Map } from 'immutable';

const InitialState = require('./kaseInitialState').default;
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
  SET_STATE,
  BEFORE_CREATE_PRODUCT_REQUEST,
  BEFORE_CREATE_PRODUCT_SUCCESS,
  BEFORE_CREATE_PRODUCT_FAILURE,
  SAVE_COMMENT_SUCCESS,

  REJECT_CASE_REQUEST,
  REJECT_CASE_SUCCESS,
  REJECT_CASE_FAILURE,

} = require('../constants').default;

const initialState = new InitialState();

// case list helper
function caseIdsFromAction(action) {
  return (action.payload.case_list || []).map(item =>
    item.case_sn,
  );
}

function caseMapFromAction(action) {
  return (action.payload.case_list || []).reduce((result, item) =>
      result.set(item.case_sn, item),
    Map(),
  );
}

// case list reducer
function caseListReducer(state = initialState, action) {
  const { selectedPage } = action.payload;
  switch (action.type) {
    case GET_CASE_LIST_REQUEST:
      return state.set('selectedPage', selectedPage)
        .setIn(['pages', selectedPage, 'isFetching'], true);
    case GET_CASE_LIST_SUCCESS:
      return state.mergeIn(['kases'], caseMapFromAction(action))
        .setIn(['pages', selectedPage, 'isFetching'], false)
        .setIn(['pages', selectedPage, 'items'], caseIdsFromAction(action))
        .setIn(['pages', selectedPage, 'totalCount'], action.payload.total_count)
        .setIn(['pages', selectedPage, 'pageSize'], action.payload.page_size);
    case GET_CASE_LIST_FAILURE:
      return state.setIn(['pages', selectedPage, 'isFetching'], false)
        .setIn(['pages', selectedPage, 'exception'], action.payload);
    default:
      break;
  }
  return state;
}

function kaseDetailReducer(state = initialState, action) {
  const kaseSn = state.get('selectedKase');
  switch (action.type) {
    case BEFORE_CREATE_PRODUCT_REQUEST:
    case GET_KASE_DETAIL_REQUEST: {
      return state.set('selectedKase', action.payload)
        .setIn(['pages', action.payload, 'isFetching'], true);
    }
    case BEFORE_CREATE_PRODUCT_SUCCESS:
    case GET_KASE_DETAIL_SUCCESS: {
      return state.setIn(['pages', kaseSn, 'isFetching'], false)
        .setIn(['kases', kaseSn], action.payload.case_info)
        .setIn(['pages', kaseSn, 'exception'], null);
    }
    case BEFORE_CREATE_PRODUCT_FAILURE:
    case GET_KASE_DETAIL_FAILURE:
      return state.setIn(['pages', kaseSn, 'isFetching'], false)
        .setIn(['pages', kaseSn, 'exception'], action.payload);
    case SAVE_COMMENT_SUCCESS: {
      let nextState = state;
      const kase = state.getIn(['kases', kaseSn]);
      if (kase) {
        nextState = state.setIn(['kases', kaseSn], { ...kase, comment_count: kase.comment_count + 1 });
      }
      return nextState;
    }
    default:
      return state;
  }
}
function optKaseReducer(state = initialState, action) {
  switch (action.type) {
    case REJECT_CASE_REQUEST:
      return state.setIn(['pages', 'optKase', 'isFetching'], true)
        .setIn(['pages', 'optKase', 'exception'], null);
    case REJECT_CASE_SUCCESS:
      return state.setIn(['pages', 'optKase', 'isFetching'], false)
        .setIn(['pages', 'optKase', 'exception'], null);
    case REJECT_CASE_FAILURE:
      return state.setIn(['pages', 'optKase', 'isFetching'], false)
        .setIn(['pages', 'optKase', 'exception'], action.payload);
    default:
      return state;
  }
}

export default function caseReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }

  switch (action.type) {

    case GET_CASE_LIST_REQUEST:
    case GET_CASE_LIST_SUCCESS:
    case GET_CASE_LIST_FAILURE:
      return caseListReducer(state, action);

    case BEFORE_CREATE_PRODUCT_REQUEST:
    case BEFORE_CREATE_PRODUCT_SUCCESS:
    case BEFORE_CREATE_PRODUCT_FAILURE:
    case GET_KASE_DETAIL_REQUEST:
    case GET_KASE_DETAIL_SUCCESS:
    case GET_KASE_DETAIL_FAILURE:
    case SAVE_COMMENT_SUCCESS:
      return kaseDetailReducer(state, action);

    case SET_STATE:
      return state;

    case CREATE_CASE_REQUEST:
    case MODIFY_CASE_REQUEST:
      return state.setIn(['create', 'isFetching'], true)
        .setIn(['create', 'exception'], null);

    case CREATE_CASE_SUCCESS:
    case MODIFY_CASE_SUCCESS:
      return state.setIn(['create', 'isFetching'], false)
        .setIn(['create', 'exception'], null);

    case CREATE_CASE_FAILURE:
    case MODIFY_CASE_FAILURE:
      return state.setIn(['create', 'isFetching'], false)
        .setIn(['create', 'exception'], action.payload);
    case REJECT_CASE_REQUEST:
    case REJECT_CASE_SUCCESS:
    case REJECT_CASE_FAILURE:
      return optKaseReducer(state, action);
    default:
      break;
  }
  return state;
}
