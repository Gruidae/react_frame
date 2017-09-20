/* eslint-disable new-cap */
import { Record } from 'immutable';

const InitialState = Record({
  currentUser: null,
  showState: false,
  currentState: null,
  store: null,
  isFetching: null,
});

export default InitialState;
