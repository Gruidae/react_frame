/* eslint-disable new-cap */
import { Record, Map } from 'immutable';

const create = new Record({
  isFetching: false,
  exception: null,
});

const InitialState = Record({
  create: new create(),
  kases: Map(),
  selectedPage: null,
  selectedKase: null, // case_sn
  pages: Map(),
  caseProgress: {},
  operationLog: [],
});

export default InitialState;
