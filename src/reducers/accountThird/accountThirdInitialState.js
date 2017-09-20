/* eslint-disable new-cap */
import { Record } from 'immutable';

const InitialState = Record({
  exception: null,
  isFetching: false,
  url: null,
});

export default InitialState;
