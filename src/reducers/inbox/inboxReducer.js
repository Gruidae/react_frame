import InitialState from './inboxInitialState';

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

  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} = require('../constants').default;

const initialState = new InitialState();

const msgTypes = {
  1: 'comment',
  2: 'sysNotice',
};

const msgTypeFieldNames = {
  1: 'new_comment',
  2: 'new_sys_notice',
};

export default function inboxReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }
  switch (action.type) {
    case GET_NEW_MSG_COUNT_REQUEST:
    case CLEAR_NEW_MSG_COUNT_REQUEST:
    case GET_MSG_LIST_REQUEST:
      return state.set('isFetching', true).set('exception', null);

    case GET_MSG_LIST_SUCCESS:
      return state
        .setIn([msgTypes[action.payload.type], 'list'], action.payload.msg_list)
        .setIn([msgTypes[action.payload.type], 'pageSize'], action.payload.page_size)
        .setIn([msgTypes[action.payload.type], 'totalCount'], action.payload.total_count)
        .setIn([msgTypes[action.payload.type], 'currentPage'], action.payload.page)
        .set('isFetching', false);
    case GET_NEW_MSG_COUNT_SUCCESS: {
      let nextState = state;
      Object.keys(msgTypes).forEach((i) => {
        nextState = nextState.setIn([msgTypes[i], 'newMsgCount'], action.payload[msgTypeFieldNames[i]]);
      });
      nextState = nextState.set('isFetching', false);
      return nextState;
    }
    case CLEAR_NEW_MSG_COUNT_SUCCESS:
      return state.setIn([msgTypes[action.payload.type], 'newMsgCount'], 0);

    case GET_MSG_LIST_FAILURE:
    case GET_NEW_MSG_COUNT_FAILURE:
    case CLEAR_NEW_MSG_COUNT_FAILURE:
      return state.set('isFetching', false).set('exception', action.payload);

    case LOGIN_SUCCESS:
    case LOGOUT_SUCCESS:
      return state.set('isFetching', false).set('exception', null);

    default:
      break;
  }

  return state;
}
