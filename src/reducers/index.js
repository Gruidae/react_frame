import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import global from './global/globalReducer';
import device from './device/deviceReducer';
import auth from './auth/authReducer';
import profile from './profile/profileReducer';
import product from './product/productReducer';
import kase from './kase/kaseReducer';
import comment from './comment/commentReducer';
import qiniu from './qiniu/qiniuReducer';
import bidAuth from './bidAuth/bidAuthReducer';
import accountThird from './accountThird/accountThirdReducer';
import inbox from './inbox/inboxReducer';
import nav from './nav/navReducer';

const rootReducer = combineReducers({
  global,
  nav,
  device,
  profile,
  auth,
  product,
  kase,
  comment,
  qiniu,
  bidAuth,
  inbox,
  accountThird,
  routing: routerReducer,
});

export default rootReducer;
