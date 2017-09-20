import InitialState from './commentInitialState';

const {
  GET_COMMENT_LIST_REQUEST,
  GET_COMMENT_LIST_SUCCESS,
  GET_COMMENT_LIST_FAILURE,

  SAVE_COMMENT_REQUEST,
  SAVE_COMMENT_SUCCESS,
  SAVE_COMMENT_FAILURE,

  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILURE,
} = require('../constants').default;

const initialState = new InitialState();

export default function commentReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }

  const payload = action.payload;

  switch (action.type) {

    case GET_COMMENT_LIST_REQUEST:
    case SAVE_COMMENT_REQUEST:
    case DELETE_COMMENT_REQUEST:
      return state.setIn(['comments', payload.targetType, payload.targetId, 'isFetching'], true)
        .setIn(['comments', payload.targetType, payload.targetId, 'exception'], null);

    case GET_COMMENT_LIST_SUCCESS:
      return state.setIn(['comments', payload.targetType, payload.targetId, 'isFetching'], false)
        .setIn(['comments', payload.targetType, payload.targetId, 'totalCount'], payload.total_count)
        .setIn(['comments', payload.targetType, payload.targetId, 'pageSize'], payload.page_size)
        .setIn(['comments', payload.targetType, payload.targetId, 'items'], payload.comment_list)
        .setIn(['comments', payload.targetType, payload.targetId, 'currentPage'], payload.page);

    case SAVE_COMMENT_SUCCESS:
      return state
        .setIn(['comments', payload.targetType, payload.targetId, 'isFetching'], false)
        .setIn(['comments', payload.targetType, payload.targetId, 'exception'], null)
        .updateIn(['comments', payload.targetType, payload.targetId, 'totalCount'], x => x + 1)
        .updateIn(['comments', payload.targetType, payload.targetId, 'items'], (items) => {
          const nextItems = items || [];
          nextItems.unshift(payload.comment_info);
          return nextItems;
        });

    case DELETE_COMMENT_SUCCESS:
      // TODO
      break;

    case GET_COMMENT_LIST_FAILURE:
    case SAVE_COMMENT_FAILURE:
    case DELETE_COMMENT_FAILURE:
      return state
        .setIn(['comments', payload.targetType, payload.targetId, 'isFetching'], false)
        .setIn(['comments', payload.targetType, payload.targetId, 'exception'], payload);

    default:
      break;
  }

  return state;
}
