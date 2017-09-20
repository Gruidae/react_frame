/* eslint-disable new-cap */
import { Record, List } from 'immutable';

const Comment = Record({
  list: List(),
  totalCount: 0,
  pageSize: 0,
  currentPage: 1,
  newMsgCount: 0,
});

const SysNotice = Record({
  list: List(),
  totalCount: 0,
  pageSize: 0,
  currentPage: 1,
  newMsgCount: 0,
});

const InitialState = Record({
  comment: new Comment(),
  sysNotice: new SysNotice(),
  isFetching: false,
  exception: null,
});

export default InitialState;
