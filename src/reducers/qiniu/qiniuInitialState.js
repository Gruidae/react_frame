/* eslint-disable new-cap */
import { Record } from 'immutable';

const {
  UPLOAD_ATTACH,
} = require('../constants').default;

const InitialState = Record({
  scene: UPLOAD_ATTACH,
  exception: null,
  isFetching: false,
  token: null,
});

export default InitialState;
