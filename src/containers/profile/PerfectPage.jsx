import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin, Row, Col, Form, Input, Tooltip, Icon, Button, Switch } from 'antd';

import s from './LoginPage.less';
import errorHandler from '../../utils/errorHandler';
import * as authActions from '../../reducers/auth/authActions';
import * as profileActions from '../../reducers/profile/profileActions';
import * as navActions from '../../reducers/nav/navActions';
import Enhance from '../Enhance';

const FormItem = Form.Item;
const phoneRegExp = new RegExp(/^(((1[3|4|5|7|8|9]{1}[0-9]{1}))[0-9]{8})$/);
const title = '完善个人资料';

function mapStateToProps(state) {
  return {
    profile: state.profile,
    auth: state.auth,
    global: state.global,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...profileActions, ...authActions, ...navActions }, dispatch),
  };
}

class PerfectPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      counter: -1,
      timerId: 0,
    };
  }

  componentDidMount() {
    this.props.enhance.setTitle(title);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth !== this.props.auth) {
      this.setState({
        loading: nextProps.auth.isFetching,
      });
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
    if (nextProps.profile !== this.props.profile) {
      this.setState({
        loading: nextProps.profile.isFetching,
      });
    }
    errorHandler.handle(nextProps.auth.exception);
    errorHandler.handle(nextProps.profile.exception);
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.actions.perfect(values.phone, values.code, values.nickname,
          values.companyName, values.switch ? 1 : 0);
      }
    });
  };

  handleSendCodeClick = () => {
    this.props.form.validateFieldsAndScroll(['phone'], (err, values) => {
      if (!err) {
        this.props.actions.sendCode(values.phone, 'REGISTER');
      }
    });
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

          <FormItem {...tailFormItemLayout}>
            <Button
              className={s.loginButton}
              type="primary" htmlType="submit" size="large"
            >保存</Button>
          </FormItem>

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
          <Spin spinning={this.state.loading}>{this.renderForm()}</Spin>
        </Col>
      </Row>
    );
  }
}

/* eslint-disable no-class-assign */
PerfectPage = Form.create({})(PerfectPage);

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(PerfectPage));
