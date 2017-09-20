import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Form, Input, Button, Spin, Checkbox, Icon } from 'antd';
import storage from '../../utils/storage';

import s from './LoginPage.less';
import errorHandler from '../../utils/errorHandler';
import * as navActions from '../../reducers/nav/navActions';
import * as authActions from '../../reducers/auth/authActions';
import * as accountThirdActions from '../../reducers/accountThird/accountThirdActions';
import Enhance from '../Enhance';
import wechatImage from '../../img/wechat.png';

const FormItem = Form.Item;
const title = '登录';

function mapStateToProps(state) {
  return {
    global: state.global,
    auth: state.auth,
    device: state.device,
    accountThird: state.accountThird,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...authActions, ...accountThirdActions, ...navActions }, dispatch),
  };
}

class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      passwordDirty: false,
    };
    this.isThirdLogin = false;
    // 如果是微信打开，则直接跳微信高级授权
    if (this.props.device.isWechat) {
      this.thirdLogin('Weixin_MP');
    }
    // 记住登录前的URL
    if (this.props.location
        && this.props.location.state
        && this.props.location.state.referer) {
      storage.save('loginReferer', this.props.location.state.referer);
    }
  }

  componentDidMount() {
    this.props.enhance.setTitle(title);
    if (this.props.global.currentUser) {
      this.props.router.replace('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.global !== this.props.global) {
      if (!nextProps.auth.exception && nextProps.global.currentUser) {
        this.props.router.replace(storage.getOnce('loginReferer') || '/');
      }
    }
    errorHandler.handle(nextProps.auth.exception);
  }

  onBindWechat = (event) => {
    event.preventDefault();
    this.props.actions.getThirdLoginUrl('Weixin_Web');
  };

  thirdLogin = (source) => {
    this.isThirdLogin = true;
    this.props.actions.getThirdLoginUrl(source);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.actions.login(values.email, values.password);
      }
    });
  };

  handlePasswordBlur = (event) => {
    const value = event.target.value;
    this.setState({
      passwordDirty: this.state.passwordDirty || !!value,
    });
  };

  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row type="flex" justify="space-around">
        <Form className={s.login_form} horizontal onSubmit={this.handleSubmit}>

          <FormItem hasFeedback>
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: '邮箱格式不正确',
              }, {
                required: true, message: '请输入邮箱',
              }],
            })(
              <Input
                addonBefore={<Icon type="mail" />}
                size="large"
                type="email"
                placeholder="请输入邮箱"
              />,
            )}
          </FormItem>

          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码',
              }, {
                validator: this.checkConfirm,
              }],
            })(
              <Input
                addonBefore={<Icon type="lock" />}
                size="large"
                type="password"
                placeholder="请输入密码"
                onBlur={this.handlePasswordBlur}
              />,
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>记住密码</Checkbox>)}
            <a
              className={s.login_form_forgot}
              target="_blank"
              rel="noopener noreferrer"
              href="http://open.bigins.cn/password/"
            >
              忘记密码？
            </a>
            <Button className={s.loginButton} type="primary" htmlType="submit" size="large">
              登录
            </Button>
          </FormItem>

          <Row justify="center">
            海绵保开放平台、SaaS平台账号可直接使用邮箱登录<br />
            还没有账号？<Link to="/register">立即注册</Link>
          </Row>

          <Row justify="center" className={s.third_login}>
            <Row justify="center" className={s.group_title}>
              <i style={{ height: '1px' }} />
              <span>第三方登录</span>
              <i style={{ height: '1px' }} />
            </Row>
            <Row>
              <Col onClick={this.onBindWechat}>
                <img alt="wechat" src={wechatImage} className={s.icon} />
              </Col>
            </Row>
          </Row>

        </Form>
      </Row>
    );
  };

  render() {
    if (this.isThirdLogin) {
      return <div />;
    }
    return (
      <Row type="flex" justify="center" align="middle" className={s.container}>
        <Col xs={22} sm={8} md={8} lg={8}>
          <Row justify="center" className={s.logo}>
            <img alt="logo" src="/img/logo.png" />
          </Row>
          <Row justify="center">
            <h1 className={s.header}>欢迎来到海绵拍</h1>
          </Row>
          <Spin spinning={this.props.auth.isFetching || this.props.accountThird.isFetching}>
            {this.renderForm()}
          </Spin>
        </Col>
      </Row>
    );
  }
}

/* eslint-disable no-class-assign */
export default connect(mapStateToProps, mapDispatchToProps)(Form.create({})(Enhance(LoginPage)));
