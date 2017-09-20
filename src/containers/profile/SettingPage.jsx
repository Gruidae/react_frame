import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Modal, Input, Button, Alert, Switch } from 'antd';

import s from './SettingPage.less';
import errorHandler from '../../utils/errorHandler';
import * as authActions from '../../reducers/auth/authActions';
import * as navActions from '../../reducers/nav/navActions';
import * as profileActions from '../../reducers/profile/profileActions';
import * as accountThirdActions from '../../reducers/accountThird/accountThirdActions';
import AuthWrapper from '../components/AuthWrapper';
import Enhance from '../Enhance';
import { PAGE_TITLE_MY_SETTING } from '../constants';
import wechatImage from '../../img/wechat.png';

const CHANGE_NICKNAME = 1;
const CHANGE_MOBILE = 2;
const CHANGE_COMPANY = 3;
const CHANGE_PASSWORD = 4;

function mapStateToProps(state) {
  return {
    global: state.global,
    auth: state.auth,
    profile: state.profile,
    third: state.accountThird,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...profileActions, ...authActions, ...accountThirdActions, ...navActions,
    }, dispatch),
  };
}

function SettingItem(props) {
  let button = null;
  if (props.onClick) {
    button = props.onClick && props.disabled ?
      <Button type="primary" size="small" onClick={props.onClick} disabled>{props.button || '修改'}</Button>
      :
      <Button type="primary" size="small" onClick={props.onClick}>{props.button || '修改'}</Button>;
  }
  return (
    <Row type="flex" align="middle" justify="space-around" className={s.item}>
      <Col span={6}>{props.field}</Col>
      <Col span={10}>{props.children}</Col>
      <Col span={8}>{button}</Col>
    </Row>
  );
}

function SettingSwitchItem(props) {
  return (
    <Row type="flex" align="middle" justify="space-between" className={s.item}>
      <Col span={6}>{props.field}</Col>
      <Col span={8}>
        <Switch defaultChecked={props.checked} onChange={props.onChange} />
      </Col>
    </Row>
  );
}

class SettingPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalMode: 0,
      modalVisible: false,
      modalTitle: null,
      modalContent: false,
      form: {
        error: false,
        message: '',
      },
      counter: -1,
      timerId: 0,
    };
  }

  componentDidMount() {
    this.props.enhance.setTitle(PAGE_TITLE_MY_SETTING);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile !== this.props.profile) {
      this.setState({
        loading: nextProps.profile.isFetching,
      });
      this.dismissModal();
    }
    if (nextProps.auth !== this.props.auth) {
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
          this.setState({ timerId });
        });
      }
    }
    errorHandler.handle(nextProps.auth.exception);
    errorHandler.handle(nextProps.profile.exception);
    errorHandler.handle(nextProps.third.exception);
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId);
  }

  onFormInputChange = (event) => {
    const { id, value } = event.target;
    const form = this.state.form;
    form[id] = value;
    this.setState({
      form,
    });
  };

  onChangeNickname = () => {
    this.setState({
      modalMode: CHANGE_NICKNAME,
      modalVisible: true,
      modalTitle: '更换昵称',
      modalContent: (
        <Input
          id="nickname"
          type="text"
          defaultValue={this.props.global.currentUser.nickname}
          placeholder="昵称"
          onChange={this.onFormInputChange}
          onPressEnter={this.handleOk}
        />
      ),
    });
  };

  onChangeCompany = () => {
    this.setState({
      modalMode: CHANGE_COMPANY,
      modalVisible: true,
      modalTitle: '更换所属公司',
      modalContent: (
        <Input
          id="company"
          type="text"
          defaultValue={this.props.global.currentUser.company_name}
          placeholder="公司名称"
          onChange={this.onFormInputChange}
          onPressEnter={this.handleOk}
        />
      ),
    });
  };

  onChangeMobile = () => {
    this.setState({
      modalMode: CHANGE_MOBILE,
      modalVisible: true,
      modalTitle: '更换手机号',
      modalContent: (
        <Row>
          <Col span={24} className={s.formItem}>
            <Input
              id="mobile"
              type="text"
              onChange={this.onFormInputChange}
              placeholder="新的手机号码"
            />
          </Col>
          <Col span={18} className={s.formItem}>
            <Input
              id="code"
              type="text"
              onChange={this.onFormInputChange}
              placeholder="验证码"
              onPressEnter={this.handleOk}
            />
          </Col>
          <Col offset={1} span={5} className={s.formButton}>
            <Button onClick={this.handleSendCodeClick}>获取验证码</Button>
          </Col>
        </Row>
      ),
    });
  };

  onChangePassword = (event) => {
    event.preventDefault();
    this.setState({
      modalMode: CHANGE_PASSWORD,
      modalVisible: true,
      modalTitle: '修改密码',
      modalContent: (
        <Row>
          <Col span={24} className={s.formItem}>
            <Input
              id="oldPassword"
              type="password"
              onChange={this.onFormInputChange}
              placeholder="原密码"
            />
          </Col>
          <Col span={24} className={s.formItem}>
            <Input
              id="newPassword"
              type="password"
              onChange={this.onFormInputChange}
              placeholder="新密码"
            />
          </Col>
          <Col span={24} className={s.formItem}>
            <Input
              id="newPasswordRe"
              type="password"
              onChange={this.onFormInputChange}
              placeholder="确认新密码"
              onPressEnter={this.handleOk}
            />
          </Col>
        </Row>
      ),
    });
  };

  onChangeSwitch = (switchType, checked) => {
    const switchValue = checked ? 1 : 0;
    this.props.actions.changeSwitch(switchType, switchValue);
  };

  onBindWechat = () => {
    this.props.actions.getThirdLoginUrl('Weixin_Web');
  };

  onBindQQ = (event) => {
    event.preventDefault();
  };

  onBindLinkedIn = (event) => {
    event.preventDefault();
  };

  onBindAlipay = (event) => {
    event.preventDefault();
  };

  onBindWeibo = (event) => {
    event.preventDefault();
  };

  handleSendCodeClick = () => {
    if (this.state.counter > 0) {
      this.setState(prevState => ({
        form: {
          ...prevState.form,
          error: true,
          message: `请在${prevState.counter}秒后重试`,
        },
      }));
    } else {
      this.props.actions.sendCode(this.state.form.mobile, 'CHANGE_INFO');
    }
  };

  dismissModal = () => {
    this.setState({
      modalVisible: false,
      modalContent: false,
      form: {
        error: false,
        message: '',
      },
    });
  };

  handleOk = () => {
    const form = this.state.form;
    switch (this.state.modalMode) {
      case CHANGE_NICKNAME:
        if (form.nickname) {
          this.props.actions.changeNickname(form.nickname);
        } else {
          this.dismissModal();
        }
        break;
      case CHANGE_COMPANY:
        if (form.company) {
          this.props.actions.changeCompany(form.company);
        } else {
          this.dismissModal();
        }
        break;
      case CHANGE_MOBILE:
        if (form.mobile && !form.code) {
          this.setState({
            form: {
              error: true,
              message: '验证码不能为空',
            },
          });
        } else if (form.mobile && form.code) {
          this.props.actions.changeMobile(form.mobile, form.code);
        } else {
          this.dismissModal();
        }
        break;
      case CHANGE_PASSWORD:
        if (form.newPassword && form.newPasswordRe && !form.oldPassword) {
          this.setState(prevState => ({
            form: {
              ...prevState.form,
              error: true,
              message: '请输入原密码',
            },
          }));
        } else if (form.oldPassword && form.newPassword !== form.newPasswordRe) {
          this.setState(prevState => ({
            form: {
              ...prevState.form,
              error: true,
              message: '两次新密码输入好像不一样哦',
            },
          }));
        } else if (form.oldPassword && form.newPassword && form.newPasswordRe) {
          if (form.oldPassword === form.newPassword) {
            this.setState(prevState => ({
              form: {
                ...prevState.form,
                error: true,
                message: '喂喂喂，压根没变啊！',
              },
            }));
          } else {
            this.props.actions.changePassword(form.oldPassword, form.newPassword);
          }
        } else {
          this.dismissModal();
        }
        break;
      default:
        break;
    }
  };

  render() {
    const user = this.props.global.currentUser || {};
    return (
      <AuthWrapper router={this.props.router}>
        <Row className={s.container}>
          <Col
            xs={24}
            sm={{ span: 12, offset: 6 }}
            md={{ span: 10, offset: 7 }}
            lg={{ span: 10, offset: 7 }}
          >
            <SettingItem field="昵称：" onClick={this.onChangeNickname}>{user.nickname}</SettingItem>
            <SettingItem field="手机号码：" onClick={this.onChangeMobile}>{user.mobile}</SettingItem>
            <SettingItem field="邮箱：">{user.email}</SettingItem>
            <SettingItem field="所属公司：" onClick={this.onChangeCompany}>{user.company_name}</SettingItem>
            <SettingItem field="注册时间：">{user.created_at}</SettingItem>
            <SettingItem field="密码：" onClick={this.onChangePassword}>********</SettingItem>

            {user.settings &&
            <SettingSwitchItem
              field="接收邮件通知："
              checked={user.settings.recv_email_notification}
              onChange={checked => this.onChangeSwitch('recv_email_notification', checked)}
            />
            }

            {user.has_binded_third &&
            <SettingItem
              field="第三方账户：" onClick={this.onBindWechat}
              disabled={this.props.third.isFetching || user.has_binded_third.Weixin}
              button={user.has_binded_third.Weixin ? '已绑定' : '去绑定'}
            >
              <img alt="wechat" src={wechatImage} className={s.icon} />
            </SettingItem>
            }

            <Modal
              title={this.state.modalTitle}
              visible={this.state.modalVisible}
              onOk={this.handleOk}
              confirmLoading={this.state.loading}
              onCancel={this.dismissModal}
            >
              {this.state.form.error &&
              <Row>
                <Alert message={this.state.form.message} type="error" showIcon />
              </Row>
              }
              {this.state.modalContent}
            </Modal>
          </Col>
        </Row>
      </AuthWrapper>
    );
  }
}

/* eslint-disable no-class-assign */
export default connect(mapStateToProps, mapDispatchToProps)(Enhance(SettingPage));
