/* eslint-disable new-cap */
import { Record, Map } from 'immutable';

const InitialState = Record({
  profile: null,
  exception: null,
  isFetching: false,
  profiles: Map(),
});

export default InitialState;
