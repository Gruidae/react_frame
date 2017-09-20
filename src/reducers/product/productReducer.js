import { Map } from 'immutable';

const InitialState = require('./productInitialState').default;
const {
  GET_PRODUCT_LIST_REQUEST,
  GET_PRODUCT_LIST_SUCCESS,
  GET_PRODUCT_LIST_FAILURE,
  GET_PRODUCT_DETAIL_REQUEST,
  GET_PRODUCT_DETAIL_SUCCESS,
  GET_PRODUCT_DETAIL_FAILURE,

  START_BID_REQUEST,
  START_BID_REQUEST_SUCCESS,
  START_BID_REQUEST_FAILURE,
  DROP_BID_REQUEST,
  DROP_BID_SUCCESS,
  DROP_BID_FAILURE,
  WIN_BID_REQUEST,
  WIN_BID_SUCCESS,
  WIN_BID_FAILURE,
  REJECT_BID_REQUEST,
  REJECT_BID_SUCCESS,
  REJECT_BID_FAILURE,
  SHARE_CUSTOMER_INFO_REQUEST,
  SHARE_CUSTOMER_INFO_SUCCESS,
  SHARE_CUSTOMER_INFO_FAILURE,

  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,

  MODIFY_PRODUCT_REQUEST,
  MODIFY_PRODUCT_SUCCESS,
  MODIFY_PRODUCT_FAILURE,

  CANCEL_PRODUCT_REQUEST,
  CANCEL_PRODUCT_SUCCESS,
  CANCEL_PRODUCT_FAILURE,

  SAVE_COMMENT_SUCCESS,
} = require('../constants').default;

const initialState = new InitialState();

// product list helper
function productIdsFromAction(action) {
  return (action.payload.product_list || []).map(item =>
    item.product_sn,
  );
}

function productMapFromAction(action) {
  return (action.payload.product_list || []).reduce((result, item) =>
      result.set(item.product_sn, item),
    Map(),
  );
}

// product list reducer
function productListReducer(state = initialState, action) {
  const { selectedPage } = action.payload;

  switch (action.type) {
    case GET_PRODUCT_LIST_REQUEST:
      return state.set('selectedPage', selectedPage)
        .setIn(['pages', selectedPage, 'isFetching'], true);
    case GET_PRODUCT_LIST_SUCCESS:
      return state.mergeIn(['products'], productMapFromAction(action))
        .setIn(['pages', selectedPage, 'isFetching'], false)
        .setIn(['pages', selectedPage, 'items'], productIdsFromAction(action))
        .setIn(['pages', selectedPage, 'totalCount'], action.payload.total_count)
        .setIn(['pages', selectedPage, 'pageSize'], action.payload.page_size);
    case GET_PRODUCT_LIST_FAILURE:
      return state.setIn(['pages', selectedPage, 'isFetching'], false)
        .setIn(['pages', selectedPage, 'exception'], action.payload);
    default:
      break;
  }
  return state;
}

// product detail reducer
function productDetailReducer(state = initialState, action) {
  const productSn = state.get('selectedProduct');
  switch (action.type) {
    case GET_PRODUCT_DETAIL_REQUEST: {
      return state.set('selectedProduct', action.payload)
        .setIn(['pages', action.payload, 'isFetching'], true);
    }
    case GET_PRODUCT_DETAIL_SUCCESS: {
      return state.setIn(['pages', productSn, 'isFetching'], false)
        .setIn(['products', productSn], action.payload.product_info)
        .setIn(['pages', productSn, 'exception'], null);
    }
    case GET_PRODUCT_DETAIL_FAILURE:
      return state.setIn(['pages', productSn, 'isFetching'], false)
        .setIn(['pages', productSn, 'exception'], action.payload);
    case SAVE_COMMENT_SUCCESS: {
      let nextState = state;
      const product = state.getIn(['products', productSn]);
      if (product) {
        const bidList = state.getIn(['products', productSn]).bid_list;
        if (bidList && bidList.length > 0) {
          bidList.map((bid) => {
            const nextBid = bid;
            if (bid.id === action.payload.targetId) {
              nextBid.comment_count += 1;
            }
            return nextBid;
          });
          nextState = state.setIn(['products', productSn], { ...product, bid_list: bidList });
        }
      }
      return nextState;
    }
    default:
      return state;
  }
}

function startBidReducer(state = initialState, action) {
  switch (action.type) {
    case START_BID_REQUEST:
      return state.setIn(['pages', 'startBid', 'isFetching'], true)
        .setIn(['pages', 'startBid', 'exception'], null);
    case START_BID_REQUEST_SUCCESS:
      return state.setIn(['pages', 'startBid', 'isFetching'], false)
        .setIn(['pages', 'startBid', 'exception'], null);
    case START_BID_REQUEST_FAILURE:
      return state.setIn(['pages', 'startBid', 'isFetching'], false)
        .setIn(['pages', 'startBid', 'exception'], action.payload);
    default:
      return state;
  }
}
function optBidReducer(state = initialState, action) {
  switch (action.type) {
    case DROP_BID_REQUEST:
    case WIN_BID_REQUEST:
    case REJECT_BID_REQUEST:
    case SHARE_CUSTOMER_INFO_REQUEST:
      return state.setIn(['pages', 'bid', 'isFetching'], true)
        .setIn(['pages', 'bid', 'exception'], null);

    case DROP_BID_SUCCESS:
    case WIN_BID_SUCCESS:
    case REJECT_BID_SUCCESS:
    case SHARE_CUSTOMER_INFO_SUCCESS:
      return state.setIn(['pages', 'bid', 'isFetching'], false)
        .setIn(['pages', 'bid', 'exception'], null);
    case DROP_BID_FAILURE:
    case WIN_BID_FAILURE:
    case REJECT_BID_FAILURE:
    case SHARE_CUSTOMER_INFO_FAILURE:
      return state.setIn(['pages', 'bid', 'isFetching'], false)
        .setIn(['pages', 'bid', 'exception'], action.payload);
    default:
      break;
  }
  return state;
}

export function optProductReducer(state = initialState, action) {
  switch (action.type) {
    case CANCEL_PRODUCT_REQUEST:
      return state.setIn(['pages', 'optProduct', 'isFetching'], true)
        .setIn(['pages', 'optProduct', 'exception'], null);
    case CANCEL_PRODUCT_SUCCESS:
      return state.setIn(['pages', 'optProduct', 'isFetching'], false)
        .setIn(['pages', 'optProduct', 'exception'], null);
    case CANCEL_PRODUCT_FAILURE:
      return state.setIn(['pages', 'optProduct', 'isFetching'], false)
        .setIn(['pages', 'optProduct', 'exception'], action.payload);
    default:
      break;
  }
  return state;
}

export default function productReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }

  switch (action.type) {

    case GET_PRODUCT_LIST_REQUEST:
    case GET_PRODUCT_LIST_SUCCESS:
    case GET_PRODUCT_LIST_FAILURE:
      return productListReducer(state, action);

    case GET_PRODUCT_DETAIL_REQUEST:
    case GET_PRODUCT_DETAIL_SUCCESS:
    case GET_PRODUCT_DETAIL_FAILURE:
    case SAVE_COMMENT_SUCCESS:
      return productDetailReducer(state, action);

    case START_BID_REQUEST:
    case START_BID_REQUEST_SUCCESS:
    case START_BID_REQUEST_FAILURE:
      return startBidReducer(state, action);
    case DROP_BID_REQUEST:
    case DROP_BID_SUCCESS:
    case DROP_BID_FAILURE:
    case WIN_BID_REQUEST:
    case WIN_BID_SUCCESS:
    case WIN_BID_FAILURE:
    case REJECT_BID_REQUEST:
    case REJECT_BID_SUCCESS:
    case REJECT_BID_FAILURE:
    case SHARE_CUSTOMER_INFO_REQUEST:
    case SHARE_CUSTOMER_INFO_SUCCESS:
    case SHARE_CUSTOMER_INFO_FAILURE:
      return optBidReducer(state, action);

    case CREATE_PRODUCT_REQUEST:
    case MODIFY_PRODUCT_REQUEST:
      return state.setIn(['create', 'isFetching'], true)
        .setIn(['create', 'exception'], null);

    case CREATE_PRODUCT_SUCCESS:
    case MODIFY_PRODUCT_SUCCESS:
      return state.setIn(['create', 'isFetching'], false)
        .setIn(['create', 'exception'], null);

    case CREATE_PRODUCT_FAILURE:
    case MODIFY_PRODUCT_FAILURE:
      return state.setIn(['create', 'isFetching'], false)
        .setIn(['create', 'exception'], action.payload);
    case CANCEL_PRODUCT_REQUEST:
    case CANCEL_PRODUCT_SUCCESS:
    case CANCEL_PRODUCT_FAILURE:
      return optProductReducer(state, action);
    default:
      break;
  }
  return state;
}

