import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Card, Spin, Row, Col, Icon } from 'antd';

import s from './LoginPage.less';
import errorHandler from '../../utils/errorHandler';
import * as authActions from '../../reducers/auth/authActions';
import * as navActions from '../../reducers/nav/navActions';
import AuthWrapper from '../components/AuthWrapper';
import Enhance from '../Enhance';

const title = '验证个人邮箱';

function mapStateToProps(state) {
  return {
    auth: state.auth,
    global: state.global,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...authActions, ...navActions }, dispatch),
  };
}

class ActivateEmailPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.enhance.setTitle(title);
    if (!this.props.global.currentUser) {
      this.props.router.replace('/login');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.global !== this.props.global) {
      if (!nextProps.global.currentUser) {
        this.props.router.push('/register');
      }
    }
    errorHandler.handle(nextProps.auth.exception);
  }

  onClickResend = () => {
    this.props.actions.sendActivateEmail();
  };

  onClickRegister = () => {
    this.props.actions.logout();
  };

  render() {
    return (
      <AuthWrapper router={this.props.router}>
        <Row type="flex" justify="center" align="middle" className={s.container}>
          <Col xs={24} sm={20} md={16} lg={12}>

            <Row justify="center">
              <h1 className={s.header}>{title}</h1>
            </Row>

            <Row type="flex" justify="space-around" align="middle">
              <Icon type="mail" className={s.infoIcon} />
            </Row>

            <Row className={s.infoContainer} type="flex" justify="space-around" align="middle">
              <div>感谢注册，激活邮件已发送至您的注册邮箱</div>
            </Row>

            <Row type="flex" justify="space-around" align="middle">
              <div>{this.props.location.query.email}</div>
            </Row>

            <Row type="flex" justify="space-around" align="middle">
              <div>请进入您的邮箱查看激活邮件，并在1天内激活海绵保开放平台账号。</div>
            </Row>

            <Row type="flex" justify="space-around" align="middle">
              <Spin spinning={this.props.auth.isFetching}>
                <Card className={s.infoBox}>
                  <p>1. 请检查邮箱地址是否正确，您可以返回 <Link onClick={this.onClickRegister}>重新填写</Link>。
                  </p>
                  <p>2. 检查您的邮件垃圾箱。</p>
                  <p>3. 若仍未收到邮件，请尝试 <Link onClick={this.onClickResend}>重新发送</Link>。</p>
                  <p>4. 如果你确定已经激活，请点击 <Link to="/home">前往首页</Link>。</p>
                </Card>
              </Spin>
            </Row>
          </Col>
        </Row>
      </AuthWrapper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(ActivateEmailPage));
