import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import storage from '../../utils/storage';

import * as accountThirdActions from '../../reducers/accountThird/accountThirdActions';
import * as navActions from '../../reducers/nav/navActions';
import errorHandler from '../../utils/errorHandler';
import Enhance from '../Enhance';

import s from './OAuthBridgePage.less';

function mapStateToProps(state) {
  return {
    global: state.global,
    accountThird: state.accountThird,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...accountThirdActions, ...navActions }, dispatch),
  };
}

class OAuthBridgePage extends React.Component {

  constructor(props) {
    super(props);
    this.props.actions.redirectOAuth(this.props.params.source, this.props.location.query);
  }

  componentDidMount() {
    this.props.enhance.setTitle('授权登录');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.global !== this.props.global) {
      if (!nextProps.accountThird.exception && nextProps.global.currentUser) {
        this.props.router.replace(storage.getOnce('loginReferer') || '/');
      }
    }
    errorHandler.handle(nextProps.accountThird.exception);
  }

  render() {
    return (
      <div className={s.container}>
        <Spin size="large" />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(OAuthBridgePage));
