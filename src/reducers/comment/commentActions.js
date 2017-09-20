import { message } from 'antd';
import Backend from '../../backend/Backend';
import appAuthToken from '../../backend/appAuthToken';

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

export function getCommentList(targetType, targetId, page = 1, hasAttach = 0) {
  return (dispatch) => {
    dispatch({
      type: GET_COMMENT_LIST_REQUEST,
      payload: { targetType, targetId },
    });
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).getCommentList({
          target_id: targetId,
          target_type: targetType,
          page,
          has_attach: hasAttach,
        }),
      )
      .then(json =>
        dispatch({
          type: GET_COMMENT_LIST_SUCCESS,
          payload: { ...json, targetType, targetId, page },
        }),
      )
      .catch(error =>
        dispatch({
          type: GET_COMMENT_LIST_FAILURE,
          payload: { ...error, targetType, targetId },
        }),
      );
  };
}

export function saveComment(targetType, targetId, content, attachIds, replyCmtId) {
  return (dispatch) => {
    dispatch({
      type: SAVE_COMMENT_REQUEST,
      payload: { targetType, targetId },
    });
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).saveComment({
          target_type: targetType,
          target_id: targetId,
          content,
          attach_ids: attachIds,
          reply_cmt_id: replyCmtId,
        }),
      )
      .then((json) => {
        dispatch({
          type: SAVE_COMMENT_SUCCESS,
          payload: { ...json, targetType, targetId },
        });
        message.success('消息发送成功');
      })
      .catch((error) => {
        dispatch({
          type: SAVE_COMMENT_FAILURE,
          payload: { ...error, targetType, targetId },
        });
      });
  };
}

export function deleteComment(targetType, targetId, commentId) {
  return (dispatch) => {
    dispatch({
      type: DELETE_COMMENT_REQUEST,
      payload: { targetType, targetId },
    });
    return appAuthToken.getSessionToken()
      .then(token =>
        Backend.getInstance(token).deleteComment({
          comment_id: commentId,
        }),
      )
      .then((json) => {
        dispatch({
          type: DELETE_COMMENT_SUCCESS,
          payload: { ...json, targetType, targetId },
        });
      })
      .catch((error) => {
        dispatch({
          type: DELETE_COMMENT_FAILURE,
          payload: { ...error, targetType, targetId },
        });
      });
  };
}
