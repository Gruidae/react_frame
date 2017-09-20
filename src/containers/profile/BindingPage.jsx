import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Button, Spin, Icon, Alert } from 'antd';
import storage from '../../utils/storage';

import s from './LoginPage.less';
import errorHandler from '../../utils/errorHandler';
import Enhance from '../Enhance';
import * as accountThirdActions from '../../reducers/accountThird/accountThirdActions';
import * as navActions from '../../reducers/nav/navActions';

const FormItem = Form.Item;
const title = '绑定账号';

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

class BindingPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      passwordDirty: false,
    };
  }

  componentDidMount() {
    this.props.enhance.setTitle(title);
    if (this.props.global.currentUser || !this.props.location.query.sess_id) {
      this.props.router.replace('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.global !== this.props.global) {
      if (!nextProps.accountThird.exception && nextProps.global.currentUser) {
        this.props.router.replace(storage.getOnce('loginReferer') || '/');
      }
    }
    errorHandler.handle(nextProps.accountThird.exception);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.actions.bindThirdAccount(
          values.email,
          values.password,
          this.props.location.query.sess_id,
        );
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

          <Alert
            message="请输入新邮箱注册、或输入已有账号进行绑定"
            type="info"
            showIcon
          />

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
            <a
              className={s.login_form_forgot}
              target="_blank"
              rel="noopener noreferrer"
              href="http://open.bigins.cn/password/"
            >
              忘记密码？
            </a>
            <Button
              className={s.loginButton}
              type="primary" htmlType="submit" size="large"
            >绑定</Button>
          </FormItem>

          <Row justify="center">
            海绵保开放平台、SaaS平台账号可直接使用邮箱登录
          </Row>

        </Form>
      </Row>
    );
  };

  render() {
    return (
      <Row type="flex" justify="center" align="middle" className={s.container}>
        <Col xs={22} sm={8} md={8} lg={8}>
          <Spin spinning={this.props.accountThird.isFetching}>{this.renderForm()}</Spin>
        </Col>
      </Row>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({})(Enhance(BindingPage)));
