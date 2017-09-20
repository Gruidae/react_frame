import InitialState from './navInitialState';

const {
  SET_DOCUMENT_TITLE,
} = require('../constants').default;

const initialState = new InitialState();

export default function navReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state);
  }
  switch (action.type) {
    case SET_DOCUMENT_TITLE:
      return state.set('title', action.payload);
    default:
      break;
  }
  return state;
}
