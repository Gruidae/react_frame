import { List } from 'immutable';
import InitialState from './bidAuthInitialState';

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

const initialState = new InitialState();

export default function bidAuthReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }

  switch (action.type) {
    case GET_APPLY_LIST_REQUEST:
    case PASS_BID_AUTH_REQUEST:
    case REJECT_BID_AUTH_REQUEST:
    case APPLY_BID_AUTH_REQUEST:
      return state.set('isFetching', true)
        .set('exception', null);

    case GET_APPLY_LIST_SUCCESS:
      return state
        .set('isFetching', false)
        .set('list', List(action.payload.apply_list))
        .set('pageSize', action.payload.page_size)
        .set('totalCount', action.payload.total_count);

    case PASS_BID_AUTH_SUCCESS:
    case REJECT_BID_AUTH_SUCCESS: {
      const index = state.list.findIndex(x => x.id === action.payload.applyId);
      if (index >= 0) {
        return state.set('isFetching', false)
          .setIn(['list', index], { ...state.list.get(index), status: action.payload.status, operator_nickname: action.payload.operator_nickname });
      }
      return state.set('isFetching', false);
    }
    case APPLY_BID_AUTH_SUCCESS:
      return state.set('isFetching', false);

    case PASS_BID_AUTH_FAILURE:
    case REJECT_BID_AUTH_FAILURE:
    case GET_APPLY_LIST_FAILURE:
    case APPLY_BID_AUTH_FAILURE:
      return state.set('isFetching', false)
        .set('exception', action.payload);
    default:
      break;
  }
  return state;
}
