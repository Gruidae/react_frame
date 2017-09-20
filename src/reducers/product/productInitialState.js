/* eslint-disable new-cap */
import { Record, Map } from 'immutable';

const productDetail = Record({
  isFetching: false,
  exception: null,
  detail: null,
});

const bidProductDetail = Record({
  isFetching: false,
  exception: null,
  detail: null,
});

const create = Record({
  isFetching: false,
  exception: null,
});

const InitialState = Record({
  productDetail: new productDetail(),
  bidProductDetail: new bidProductDetail(),
  create: new create(),
  caseProgress: {},
  operationLog: [],
  exception: null,
  // product list
  selectedPage: null,
  selectedProduct: null, // product_sn
  selectedBid: null, // bid_sn
  products: Map(),
  pages: Map(),

  // product list example
  //
  // selectedPage: list type + page number + keyword + urgency level
  // e.g. selectedPage: all_1_OhashiMiku_0
  //
  // products: { product id: product detail }
  // e.g. products: {
  //                  'MIDD-791': {
  //                    id: 'MIDD 791', artist: 'おおはしみく', ...
  //                  },
  //                  'MIMK-009': {
  //                    id: 'MIMK-009', artist: 'おおはしみく', ...
  //                  },
  //                }
  //
  // container : { pageKey: { isFetching: false, items: [], }, }
  // e.g. container: {
  //              all_1_OhashiMiku_0: {
  //                isFetching: true, items: [], exception: null,
  //              },
  //              myBidding_1_OhashiMiku_0: {
  //                isFetching: false, items: [ 'MIDD-791' ], exception: null,
  //              },
  //            }
});

export default InitialState;
