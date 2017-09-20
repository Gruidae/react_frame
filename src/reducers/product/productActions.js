import { notification } from 'antd';
import { replace } from 'react-router-redux';
import Backend from '../../backend/Backend';
import appAuthToken from '../../backend/appAuthToken';
import hmbProductClient from '../../backend/hmbProductClient';
import { saveComment } from '../comment/commentActions';

const {
  GET_PRODUCT_LIST_REQUEST,
  GET_PRODUCT_LIST_SUCCESS,
  GET_PRODUCT_LIST_FAILURE,
  GET_PRODUCT_DETAIL_REQUEST,
  GET_PRODUCT_DETAIL_SUCCESS,
  GET_PRODUCT_DETAIL_FAILURE,

  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,

  MODIFY_PRODUCT_REQUEST,
  MODIFY_PRODUCT_SUCCESS,
  MODIFY_PRODUCT_FAILURE,

  CANCEL_PRODUCT_REQUEST,
  CANCEL_PRODUCT_SUCCESS,
  CANCEL_PRODUCT_FAILURE,

  BEFORE_CREATE_PRODUCT_REQUEST,
  BEFORE_CREATE_PRODUCT_SUCCESS,
  BEFORE_CREATE_PRODUCT_FAILURE,

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

} = require('../constants').default;

export const productListType = {
  ALL_PRODUCTS: 0,
  MY_PUBLISHED_PRODUCTS: 1,
  MY_BIDDING_PRODUCTS: 2,
  DRAFT_PRODUCTS: 3,
};

// product list helper
function generateSelectedPage(listType, payload) {
  switch (listType) {
    case productListType.ALL_PRODUCTS:
      return `all_${payload.page}_${payload.keyword}_${payload.urgency_level}`;
    case productListType.MY_PUBLISHED_PRODUCTS:
      return `myPublication_${payload.page}_${payload.keyword}_${payload.sort_type}`;
    case productListType.MY_BIDDING_PRODUCTS:
      return `myBidding_${payload.page}_${payload.keyword}_${payload.sort_type}`;
    case productListType.DRAFT_PRODUCTS:
      return `draft_${payload.page}_${payload.keyword}_${payload.sort_type}`;
    default:
      throw new Error('Unknown product list type');
  }
}

function requestFromListType(listType) {
  switch (listType) {
    case productListType.ALL_PRODUCTS:
      return hmbProductClient.getAllProducts;
    case productListType.MY_PUBLISHED_PRODUCTS:
      return hmbProductClient.getMyPublishedProducts;
    case productListType.MY_BIDDING_PRODUCTS:
      return hmbProductClient.getMyBiddingProducts;
    case productListType.DRAFT_PRODUCTS:
      return hmbProductClient.getDraftProducts;
    default:
      throw new Error('Unknown product list type');
  }
}

function dispatchSubmitCaseRoute(dispatch, isSave) {
  if (isSave) {
    dispatch(replace('/pm/draft-products'));
  } else {
    dispatch(replace('/pm/published-products'));
  }
}

export function getProductListRequest(json) {
  return {
    type: GET_PRODUCT_LIST_REQUEST,
    payload: json,
  };
}

export function getProductListSuccess(json) {
  return {
    type: GET_PRODUCT_LIST_SUCCESS,
    payload: json,
  };
}

export function getProductListFailure(json) {
  return {
    type: GET_PRODUCT_LIST_FAILURE,
    payload: json,
  };
}

export function getProductList({ pageNumber = 1, keyword = '', urgencyLevel = 0, sortType = 0, listType = productListType.ALL_PRODUCTS }) {
  const payload = {
    page: pageNumber,
    keyword,
    urgency_level: urgencyLevel,
    sort_type: sortType,
  };
  const selectedPage = generateSelectedPage(listType, payload);

  return (dispatch) => {
    dispatch(getProductListRequest({ ...payload, selectedPage }));
    return appAuthToken.getSessionToken()
      .then(token =>
        requestFromListType(listType).call(Backend.getInstance(token), payload),
      )
      .then(json =>
        dispatch(getProductListSuccess({ ...json, selectedPage })),
      )
      .catch(error =>
        dispatch(getProductListFailure({ ...error, selectedPage })),
      );
  };
}

export function getProductDetailRequest(productSn) {
  return {
    type: GET_PRODUCT_DETAIL_REQUEST,
    payload: productSn,
  };
}

export function getProductDetailSuccess(json) {
  return {
    type: GET_PRODUCT_DETAIL_SUCCESS,
    payload: json,
  };
}

export function getProductDetailFailure(json) {
  return {
    type: GET_PRODUCT_DETAIL_FAILURE,
    payload: json,
  };
}

export function getProductDetail(productSn) {
  return (dispatch) => {
    dispatch(getProductDetailRequest(productSn));
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).getProductDetail({
          product_sn: productSn,
        }),
      )
      .then((json) => {
        dispatch(getProductDetailSuccess(json));
      })
      .catch((error) => {
        dispatch(getProductDetailFailure(error));
      });
  };
}

export function createProductRequest() {
  return {
    type: CREATE_PRODUCT_REQUEST,
  };
}

export function createProductSuccess(json) {
  return {
    type: CREATE_PRODUCT_SUCCESS,
    payload: json,
  };
}

export function createProductFailure(json) {
  return {
    type: CREATE_PRODUCT_FAILURE,
    payload: json,
  };
}

export function createProduct(params, isSave) {
  return (dispatch) => {
    dispatch(createProductRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).createProduct(params),
      )
      .then((json) => {
        dispatch(createProductSuccess(json));
        dispatchSubmitCaseRoute(dispatch, isSave);
      })
      .catch((error) => {
        dispatch(createProductFailure(error));
      });
  };
}

export function modifyProductRequest() {
  return {
    type: MODIFY_PRODUCT_REQUEST,
  };
}

export function modifyProductSuccess(json) {
  return {
    type: MODIFY_PRODUCT_SUCCESS,
    payload: json,
  };
}

export function modifyProductFailure(json) {
  return {
    type: MODIFY_PRODUCT_FAILURE,
    payload: json,
  };
}

export function modifyProduct(params, isSave) {
  return (dispatch) => {
    dispatch(modifyProductRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).modifyProduct(params),
      )
      .then((json) => {
        dispatch(modifyProductSuccess(json));
        dispatchSubmitCaseRoute(dispatch, isSave);
      })
      .catch((error) => {
        dispatch(modifyProductFailure(error));
      });
  };
}


export function beforeCreateProductRequest(kaseSn) {
  return {
    type: BEFORE_CREATE_PRODUCT_REQUEST,
    payload: kaseSn,
  };
}

export function beforeCreateProductSuccess(json) {
  return {
    type: BEFORE_CREATE_PRODUCT_SUCCESS,
    payload: json,
  };
}

export function beforeCreateProductFailure(json) {
  return {
    type: BEFORE_CREATE_PRODUCT_FAILURE,
    payload: json,
  };
}

export function beforeCreateProduct(kaseSn) {
  return (dispatch) => {
    dispatch(beforeCreateProductRequest(kaseSn));
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).beforeCreate({
          case_sn: kaseSn,
        }),
      )
      .then((json) => {
        dispatch(beforeCreateProductSuccess(json));
      })
      .catch((error) => {
        dispatch(beforeCreateProductFailure(error));
      });
  };
}

export function startBidRequest() {
  return {
    type: START_BID_REQUEST,
  };
}

export function startBidSuccess(json) {
  return {
    type: START_BID_REQUEST_SUCCESS,
    payload: json,
  };
}

export function startBidFailure(json) {
  return {
    type: START_BID_REQUEST_FAILURE,
    payload: json,
  };
}

export function startBid(productSn) {
  return (dispatch) => {
    dispatch(startBidRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).startBid({ product_sn: productSn }),
      )
      .then((json) => {
        dispatch(startBidSuccess(json));
        dispatch(replace({ ...location, pathname: `/home/bid-product/${productSn}` }));
      })
      .catch((error) => {
        dispatch(startBidFailure(error));
      });
  };
}

export function dropBidRequest() {
  return {
    type: DROP_BID_REQUEST,
  };
}

export function dropBidSuccess(json) {
  return {
    type: DROP_BID_SUCCESS,
    payload: json,
  };
}

export function dropBidFailure(json) {
  return {
    type: DROP_BID_FAILURE,
    payload: json,
  };
}

export function dropBid(bidId, productSn) {
  return (dispatch) => {
    dispatch(dropBidRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).dropBid({ bid_id: bidId }),
      )
      .then((json) => {
        dispatch(dropBidSuccess(json));
        notification.success({
          message: '放弃投标',
          description: '放弃投标成功',
        });
        dispatch(getProductDetail(productSn));
      })
      .catch((error) => {
        dispatch(dropBidFailure(error));
      });
  };
}

export function winBidRequest() {
  return {
    type: WIN_BID_REQUEST,
  };
}

export function winBidSuccess(json) {
  return {
    type: WIN_BID_SUCCESS,
    payload: json,
  };
}

export function winBidFailure(json) {
  return {
    type: WIN_BID_FAILURE,
    payload: json,
  };
}

export function winBid(bidId, productSn) {
  return (dispatch) => {
    dispatch(winBidRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).winBid({ bid_id: bidId }),
      )
      .then((json) => {
        dispatch(winBidSuccess(json));
        notification.success({
          message: '选择中标',
          description: '选择中标成功',
        });
        dispatch(getProductDetail(productSn));
      })
      .catch((error) => {
        dispatch(winBidFailure(error));
      });
  };
}

export function shareCustomerInfoRequest() {
  return {
    type: SHARE_CUSTOMER_INFO_REQUEST,
  };
}

export function shareCustomerInfoSuccess(json) {
  return {
    type: SHARE_CUSTOMER_INFO_SUCCESS,
    payload: json,
  };
}

export function shareCustomerInfoFailure(json) {
  return {
    type: SHARE_CUSTOMER_INFO_FAILURE,
    payload: json,
  };
}

export function shareCustomerInfo(bidId, productSn) {
  return (dispatch) => {
    dispatch(shareCustomerInfoRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).shareCustomerInfo({ bid_id: bidId }),
      )
      .then((json) => {
        dispatch(shareCustomerInfoSuccess(json));
        dispatch(saveComment(json));
        notification.success({
          message: '分享客户信息',
          description: '分享客户信息成功',
        });
        dispatch(getProductDetail(productSn));
      })
      .catch((error) => {
        dispatch(shareCustomerInfoFailure(error));
      });
  };
}

export function rejectBidRequest() {
  return {
    type: REJECT_BID_REQUEST,
  };
}

export function rejectBidSuccess(json) {
  return {
    type: REJECT_BID_SUCCESS,
    payload: json,
  };
}

export function rejectBidFailure(json) {
  return {
    type: REJECT_BID_FAILURE,
    payload: json,
  };
}

export function rejectBid(bidId, reason, productSn) {
  return (dispatch) => {
    dispatch(rejectBidRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).rejectBid({ bid_id: bidId, reason }),
      )
      .then((json) => {
        dispatch(rejectBidSuccess(json));
        notification.success({
          message: '拒绝投标',
          description: '拒绝投标成功',
        });
        dispatch(getProductDetail(productSn));
      })
      .catch((error) => {
        dispatch(rejectBidFailure(error));
      });
  };
}


export function cancelProductRequest() {
  return {
    type: CANCEL_PRODUCT_REQUEST,
  };
}

export function cancelProductSuccess(json) {
  return {
    type: CANCEL_PRODUCT_SUCCESS,
    payload: json,
  };
}

export function cancelProductFailure(json) {
  return {
    type: CANCEL_PRODUCT_FAILURE,
    payload: json,
  };
}

export function cancelProduct(productSn) {
  return (dispatch) => {
    dispatch(cancelProductRequest());
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).cancelProduct({ product_sn: productSn }),
      )
      .then((json) => {
        dispatch(cancelProductSuccess(json));
        notification.success({
          message: '下架产品',
          description: '下架产品成功',
        });
        dispatch(getProductDetail(productSn));
      })
      .catch((error) => {
        dispatch(cancelProductFailure(error));
      });
  };
}
