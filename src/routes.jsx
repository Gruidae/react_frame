import React from 'react';
import { applyRouterMiddleware, Router, IndexRedirect, Route, browserHistory, Redirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { useScroll } from 'react-router-scroll';

import store from './store';

import App from './containers/App';
import Home from './containers/HomePage';
import Error from './containers/global/ErrorPage';
import Case from './containers/case/CasePage';
import Pm from './containers/pm/PmPage';

import FeedListPage from './containers/product/FeedListPage';
import OrderListPage from './containers/product/OrderListPage';
import PublicationListPage from './containers/product/PublicationListPage';
import AllCaseListPage from './containers/case/AllCaseListPage';
import PublishedCaseListPage from './containers/case/PublishedCaseListPage';
import AcceptedCaseListPage from './containers/case/AcceptedCaseListPage';

import Login from './containers/profile/LoginPage';
import Binding from './containers/profile/BindingPage';
import OAuthBridge from './containers/profile/OAuthBridgePage';

const history = syncHistoryWithStore(browserHistory, store);
// history.listen(location => analyticsService.track(location.pathname))

function getSubmitCase(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/case/SubmitCasePage').default);
  }, 'SubmitCasePage');
}

function getCreateProduction(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/pm/CreateProductionPage').default);
  }, 'CreateProductionPage');
}

function getBidProductDetail(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/product/BidProductDetailPage').default);
  }, 'BidProductDetailPage');
}

function getProductDetail(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/product/ProductDetailPage').default);
  }, 'ProductDetailPage');
}

function getKaseDetail(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/case/KaseDetailPage').default);
  }, 'KaseDetailPage');
}

function getBidAuthApplyListPage(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/pm/BidAuthApplyListPage').default);
  }, 'BidAuthApplyListPage');
}

function getSettingPage(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/profile/SettingPage').default);
  }, 'SettingPage');
}

function getAboutPage(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/global/AboutPage').default);
  }, 'AboutPage');
}

function getActivateEmailPage(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/profile/ActivateEmailPage').default);
  }, 'ActivateEmailPage');
}

function getPerfectPage(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/profile/PerfectPage').default);
  }, 'PerfectPage');
}

function getRegisterPage(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/profile/RegisterPage').default);
  }, 'Register');
}

function getDraftProductListPage(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/product/DraftProductListPage').default);
  }, 'DraftProductListPage');
}

function getDraftCaseListPage(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/case/DraftCaseListPage').default);
  }, 'DraftCaseListPage');
}

function getInboxPage(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/inbox/InboxPage').default);
  }, 'InboxPage');
}

function getMessageListPage(nextState, callback) {
  require.ensure([], (require) => {
    callback(null, require('./containers/inbox/MessageListPage').default);
  }, 'MessageListPage');
}

const routes = (
  <Router history={history} key={Math.random()} render={applyRouterMiddleware(useScroll())}>
    <Redirect from="/index.html" to="/" />
    <Route path="/" component={App}>
      <IndexRedirect to="/home" />
      <Route path="home" component={Home}>
        <IndexRedirect to="feed" />
        <Route path="feed" component={FeedListPage} />
        <Route path="published-cases" component={PublishedCaseListPage} />
        <Route path="bidden-products" component={OrderListPage} />
        <Route path="product/:productSn" getComponent={getProductDetail} />
        <Route path="bid-product/:productSn" getComponent={getBidProductDetail} />
        <Route path="case/:caseId" getComponent={getKaseDetail} />
      </Route>
      <Route path="case" component={Case}>
        <IndexRedirect to="submit" />
        <Route path="submit" getComponent={getSubmitCase} />
        <Route path="product/:productSn" getComponent={getProductDetail} />
        <Route path="bid-product/:productSn" getComponent={getBidProductDetail} />
        <Route path="draft" getComponent={getDraftCaseListPage} />
        <Route path="case/:caseId" getComponent={getKaseDetail} />
      </Route>
      <Route path="pm" component={Pm}>
        <IndexRedirect to="cases" />
        <Route path="cases" component={AllCaseListPage} />
        <Route path="accepted-cases" component={AcceptedCaseListPage} />
        <Route path="published-products" component={PublicationListPage} />
        <Route path="draft-products" getComponent={getDraftProductListPage} />
        <Route path="create-product/:caseId" getComponent={getCreateProduction} />
        <Route path="apply-list" getComponent={getBidAuthApplyListPage} />
        <Route path="product/:productSn" getComponent={getProductDetail} />
        <Route path="bid-product/:productSn" getComponent={getBidProductDetail} />
        <Route path="case/:caseId" getComponent={getKaseDetail} />
      </Route>
      <Route path="inbox" getComponent={getInboxPage}>
        <IndexRedirect to="msg-list/1" />
        <Route path="msg-list/:type" getComponent={getMessageListPage} />
      </Route>
      <Route path="setting" getComponent={getSettingPage} />
      <Route path="about" getComponent={getAboutPage} />
      <Route path="login" component={Login} />
      <Route path="register" getComponent={getRegisterPage} />
      <Route path="perfect" getComponent={getPerfectPage} />
      <Route path="binding" component={Binding} />
      <Route path="oauth-bridge/:source" component={OAuthBridge} />
      <Route path="activate" getComponent={getActivateEmailPage} />
      <Route path="*" component={Error} />
    </Route>
  </Router>
);

export default routes;
