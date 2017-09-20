/* eslint-disable new-cap */
import { Record } from 'immutable';

const InitialState = Record({
  isMobile: false,
  isWechat: false,
  isIos: false,
  platform: '',
  version: null,
});

export default InitialState;
