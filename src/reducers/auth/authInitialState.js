/* eslint-disable new-cap */
import { Record } from 'immutable';

const {
  REGISTER,
} = require('../constants').default;

const InitialState = Record({
  state: REGISTER,
  disabled: false,
  exception: null,
  isValid: false,
  isFetching: false,
  counter: -1,
  sessId: '',
  captUrl: '',
  //   fields: new (Record({
  //     username: '',
  //     usernameHasError: false,
  //     usernameErrorMsg: '',
  //     email: '',
  //     emailHasError: false,
  //     emailErrorMsg: '',
  //     password: '',
  //     passwordHasError: false,
  //     passwordErrorMsg: '',
  //     passwordAgain: '',
  //     passwordAgainHasError: false,
  //     passwordAgainErrorMsg: '',
  //     showPassword: false,
  //   })),
});

export default InitialState;
