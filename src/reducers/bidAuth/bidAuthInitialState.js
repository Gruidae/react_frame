/* eslint-disable new-cap */
import { Record, List } from 'immutable';

const InitialState = Record({
  selectedStatus: 0,
  totalCount: 0,
  pageSize: 0,
  list: List(),
  currentPage: 1,
  isFetching: false,
  exception: null,
});

export default InitialState;
