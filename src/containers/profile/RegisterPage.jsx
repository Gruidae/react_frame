import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Spin, Row, Col, Form, Input, Tooltip, Icon, Checkbox, Button, Switch, Alert } from 'antd';
import storage from '../../utils/storage';
import ImageCaptcha from '../components/ImageCaptcha';
import s from './LoginPage.less';
import errorHandler from '../../utils/errorHandler';
import * as authActions from '../../reducers/auth/authActions';
import windowUtils from '../windowUtils';

const FormItem = Form.Item;

const title = '注册账户';
const phoneRegExp = new RegExp(/^(((1[3|4|5|7|8|9]{1}[0-9]{1}))[0-9]{8})$/);

function mapStateToProps(state) {
  return {
    auth: state.auth,
    global: state.global,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch),
  };
}

class RegisterPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      passwordDirty: false,
      loading: false,
      counter: -1,
      timerId: 0,
      imageCaptchaSessId: '',
      imageCaptcha: null,
      imageCaptchaUrl: '',
      imageCaptchaVisible: false,
    };
  }

  componentDidMount() {
    windowUtils.setTitle(title);
    if (this.props.global.currentUser) {
      this.props.router.replace('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth !== this.props.auth) {
      this.setState({
        loading: nextProps.auth.isFetching,
        imageCaptchaVisible: !!nextProps.auth.captUrl,
      });
      if (nextProps.auth.captUrl) {
        this.setState({
          imageCaptchaUrl: nextProps.auth.captUrl,
          imageCaptchaSessId: nextProps.auth.sessId,
        });
      }
      if (nextProps.auth.counter > 0) {
        clearInterval(this.state.timerId);
        this.setState({
          counter: nextProps.auth.counter,
        }, () => {
          const timerId = setInterval(() => {
            if (this.state.counter <= 0) {
              clearInterval(this.state.timerId);
            } else {
              this.setState(prevState => ({
                counter: prevState.counter - 1,
              }));
            }
          }, 1000);
          this.setState({
            timerId,
          });
        });
      }
    }
    if (nextProps.global !== this.props.global) {
      if (!nextProps.auth.exception && nextProps.global.currentUser) {
        this.props.router.replace(storage.getOnce('loginReferer') || '/');
      }
    }
    errorHandler.handle(nextProps.auth.exception);
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId);
  }

  onCaptchaCancel = () => {
    this.setState({
      imageCaptchaVisible: false,
    });
  };

  onSubmitImageCaptcha = (value) => {
    this.setState({
      imageCaptcha: value,
      imageCaptchaVisible: false,
    }, this.handleSendCodeClick);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.actions.signup(values.email, values.password,
          values.phone, values.code, values.nickname, values.companyName, values.switch ? 1 : 0);
      }
    });
  };

  handleSendCodeClick = () => {
    this.props.form.validateFieldsAndScroll(['phone'], (err, values) => {
      if (!err) {
        this.props.actions.sendCode(values.phone, 'REGISTER', this.state.imageCaptcha, this.state.imageCaptchaSessId);
      }
    });
  };

  handlePasswordBlur = (event) => {
    const value = event.target.value;
    this.setState({
      passwordDirty: this.state.passwordDirty || !!value,
    });
  };

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码必须一致');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.passwordDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };
    const disabled = this.state.counter > 0;

    return (
      <Row>
        <Form className={s.login_form} horizontal onSubmit={this.handleSubmit}>

          <Row>
            <Col span={6} />
            <Col span={14}>
              <Alert
                message="海绵保开放平台、SaaS平台账号可直接用邮箱登录。无需重复注册"
                type="info"
                showIcon
              />
            </Col>
          </Row>

          <FormItem
            {...formItemLayout}
            label="邮箱"
            hasFeedback
          >
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: '邮箱格式不正确',
              }, {
                required: true, message: '请输入邮箱',
              }],
            })(
              <Input />,
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="手机号"
            hasFeedback
          >
            {getFieldDecorator('phone', {
              rules: [{
                pattern: phoneRegExp, message: '手机号格式不正确',
              }, {
                required: true, message: '请输入手机号',
              }],
            })(
              <Input />,
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="验证码"
            hasFeedback
          >
            <Row gutter={8}>
              <Col xs={10} sm={12} md={12} lg={12}>
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: '请输入验证码' }],
                })(
                  <Input size="large" />,
                )}
              </Col>
              <Col xs={14} sm={12} md={12} lg={12}>
                {disabled ?
                  <Button
                    size="large" disabled
                    className={s.button} onClick={this.handleSendCodeClick}
                  >
                    {this.state.counter}秒后重试
                  </Button>
                  :
                  <Button size="large" className={s.button} onClick={this.handleSendCodeClick}>
                    获取验证码
                  </Button>
                }
              </Col>
            </Row>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="密码"
            hasFeedback
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码',
              }, {
                validator: this.checkConfirm,
              }],
            })(<Input type="password" onBlur={this.handlePasswordBlur} />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="确认密码"
            hasFeedback
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请输入确认密码',
              }, {
                validator: this.checkPassword,
              }],
            })(<Input type="password" />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={(
              <span>
                    用户昵称&nbsp;
                <Tooltip title="想让别人怎么称呼您？">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
            hasFeedback
          >
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: '请输入用户昵称' }],
            })(
              <Input />,
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={(
              <span>公司名称&nbsp;
                <Tooltip title="您公司的官方名字是？">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
            hasFeedback
          >
            {getFieldDecorator('companyName', {
              rules: [{ required: true, message: '请输入公司名称' }],
            })(
              <Input />,
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="申请接单"
          >
            {getFieldDecorator('switch', {
              valuePropName: 'checked',
              initialValue: true,
              rules: [{
                required: true,
                type: 'boolean',
              }],
            })(<Switch className={s.switch} />)}
          </FormItem>

          <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
            {getFieldDecorator('agreement', {
              valuePropName: 'checked',
              initialValue: true,
              rules: [{
                required: true,
                type: 'boolean',
                message: '必须同意用户条款',
              }],
            })(
              <Checkbox>我已阅读用户条款</Checkbox>,
            )}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button
              className={s.loginButton}
              type="primary" htmlType="submit" size="large"
            >注册</Button>
          </FormItem>

          <Row justify="center" style={{ textAlign: 'center' }}>
            已有账号？<Link to="/login">立即登录 &raquo;</Link>
          </Row>

        </Form>
      </Row>
    );
  };

  render() {
    return (
      <Row type="flex" justify="center" align="middle" className={s.container}>
        <Col xs={24} sm={20} md={16} lg={12}>
          <Row justify="center">
            <h1 className={s.header_register}>{title}</h1>
          </Row>
          <div>
            <Spin spinning={this.state.loading}>{this.renderForm()}</Spin>
            <ImageCaptcha
              visible={this.state.imageCaptchaVisible}
              onSubmitImageCaptcha={this.onSubmitImageCaptcha}
              onCaptchaCancel={this.onCaptchaCancel}
              captchaUrl={this.state.imageCaptchaUrl}
            />
          </div>
        </Col>
      </Row>
    );
  }
}

/* eslint-disable no-class-assign */
RegisterPage = Form.create({})(RegisterPage);

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
