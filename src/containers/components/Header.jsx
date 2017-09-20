import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'underscore';

import { Row, Col, Menu, Icon, Popover } from 'antd';
import { TabBar } from 'antd-mobile';

import MenuItem from '../../components/MenuItem';
import s from './Header.less';
import * as authActions from '../../reducers/auth/authActions';
import {
  PAGE_TITLE_LOGIN,
  PAGE_TITLE_REGISTER,
  PAGE_TITLE_LOGOUT,
  PAGE_TITLE_HELP_PAGE,
} from '../constants';
import qrCodeImage from '../../img/qrcode.jpg';

function mapStateToProps(state) {
  return {
    currentUser: state.global.currentUser,
    title: state.nav.title,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch),
  };
}

class Header extends React.Component {

  onLogoutClick = () => {
    this.props.actions.logout();
  };

  onClickUser = (isLoggedIn) => {
    this.props.router.push(isLoggedIn ? '/setting' : '/login');
  };

  onClickBack = () => {
    this.props.router.goBack();
  };

  renderDesktopRightMenu = () =>
    <Row type="flex" align="middle" justify="end">
      <Popover
        placement="bottomRight"
        trigger="click"
        content={this.renderTopRightQrcode()}
      >
        <div className={s.qrcode} />
      </Popover>
      <Link to="/setting">
        <Col className={s.userMsg}>
          <Icon type="user" />{this.props.currentUser.nickname}
        </Col>
      </Link>
      <Link to="#" onClick={this.onLogoutClick}>
        <Col className={s.userMsg}>
          <Icon type="logout" />{PAGE_TITLE_LOGOUT}
        </Col>
      </Link>
    </Row>
    ;

  renderTopRightQrcode = () =>
    <div className={s.qrcodePopup}>
      <p>关注『海绵拍』公众号<br />随时随地查看工作事项</p>
      <img src={qrCodeImage} alt="QR Code" />
    </div>
    ;

  renderDesktopGuestMenu = () =>
    <Row type="flex" justify="end" gutter={48}>
      <Link to="/login">
        <Col className={s.panelText}>
          {PAGE_TITLE_LOGIN}
        </Col>
      </Link>
      <Link to="/register">
        <Col className={s.panelText}>
          {PAGE_TITLE_REGISTER}
        </Col>
      </Link>
      <Link to="/help">
        <Col className={s.panelText}>
          {PAGE_TITLE_HELP_PAGE}
        </Col>
      </Link>
    </Row>
    ;

  renderDesktopLeftMenu = () =>
    <Menu
      className={s.menu}
      mode="horizontal"
      defaultSelectedKeys={['/home']}
      selectedKeys={[this.props.selectedKey]}
    >
      {this.props.menu.map(item => <MenuItem key={item.menuKey} {...item} />)}
    </Menu>
    ;

  renderDesktop = isLoggedIn =>
    <Row type="flex" justify="space-around" align="middle" className={s.header}>
      <Col span={4} className={s.logo}>
        <img alt="logo" src="/img/logo.png" />
      </Col>
      <Col span={13} pull={1}>
        {isLoggedIn ? this.renderDesktopLeftMenu() : false}
      </Col>
      <Col span={7} className={s.panel}>
        {isLoggedIn ? this.renderDesktopRightMenu() : this.renderDesktopGuestMenu()}
      </Col>
    </Row>
    ;

  renderMobile = isLoggedIn =>
    <Row>
      <Row type="flex" justify="center" align="middle" className={s.topBar}>
        <Col span={8} className={s.left} onClick={this.onClickBack}>
          <Icon type="left" />
        </Col>
        <Col span={8} className={s.title}>
          <span>{this.props.title}</span>
        </Col>
        <Col span={8} className={s.right}>
          <Icon type="user" onClick={() => this.onClickUser(isLoggedIn)} />
        </Col>
      </Row>
      <Row className={s.bottomBar}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#04bef0"
          barTintColor="white"
          hidden={false}
        >
          {this.props.menu.map(item =>
            <TabBar.Item
              title={item.title}
              key={item.menuKey}
              icon={<Icon type={item.icon} />}
              selectedIcon={<Icon type={item.icon} />}
              selected={this.props.selectedKey === item.menuKey}
              badge={item.badge}
              onPress={() => this.props.router.push(item.link)}
            />,
          )}
        </TabBar>
      </Row>
    </Row>
    ;

  render() {
    const isLoggedIn = !_.isNull(this.props.currentUser) && !_.isUndefined(this.props.currentUser);
    return (
      <Row>
        <Col xs={24} sm={0} md={0} lg={0}>
          {this.renderMobile(isLoggedIn)}
        </Col>
        <Col xs={0} sm={24} md={24} lg={24}>
          {this.renderDesktop(isLoggedIn)}
        </Col>
      </Row>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
