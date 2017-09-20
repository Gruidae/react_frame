import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'underscore';

import Header from './Header';
import Footer from './Footer';
import style from './Container.less';
import windowUtils from '../windowUtils';
import * as navActions from '../../reducers/nav/navActions';
import {
  PAGE_TITLE_HOME_PAGE,
  PAGE_TITLE_CREATE_CASE,
  PAGE_TITLE_PM,
  PAGE_TITLE_INBOX,
} from '../constants';

function mapStateToProps(state) {
  return {
    currentUser: state.global.currentUser,
    newMsgCount: state.inbox.comment.newMsgCount + state.inbox.sysNotice.newMsgCount,
    device: state.device,
  };
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(navActions, dispatch),
});

class Container extends React.Component {

  static makeMenu(user, newMsgCount) {
    const menu = [];
    const menu1 = { menuKey: '/home', title: PAGE_TITLE_HOME_PAGE, link: '/home', icon: 'home' };
    const menu2 = { menuKey: '/case', title: PAGE_TITLE_CREATE_CASE, link: '/case', icon: 'edit' };
    const menu3 = { menuKey: '/pm', title: PAGE_TITLE_PM, link: '/pm', icon: 'solution' };
    const menu4 = { menuKey: '/inbox', title: PAGE_TITLE_INBOX, link: '/inbox/msg-list/1', badge: newMsgCount, icon: 'mail' };
    menu.push(menu1, menu2);
    if (!_.isNull(user) && !_.isUndefined(user) && user.is_pm) {
      menu.push(menu3);
    }
    menu.push(menu4);
    return menu;
  }

  constructor(props) {
    super(props);
    this.state = {
      menu: Container.makeMenu(this.props.currentUser, this.props.newMsgCount),
    };
    windowUtils.initialize(this.props.device.isWechat, this.props.device.isIos);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser !== this.props.currentUser) {
      this.setState({
        menu: Container.makeMenu(nextProps.currentUser, nextProps.newMsgCount),
      });
    }
    if (nextProps.newMsgCount !== this.props.newMsgCount) {
      this.setState({
        menu: Container.makeMenu(nextProps.currentUser, nextProps.newMsgCount),
      });
    }
    if (nextProps.device !== this.props.device) {
      windowUtils.initialize(nextProps.device.isWechat, nextProps.device.isIos);
    }
  }

  render() {
    const location = this.props.router.location.pathname;
    const selectedKey = location.substring(0, location.indexOf('/', 1));
    return (
      <div className={style.container}>
        <Header
          menu={this.state.menu}
          selectedKey={selectedKey}
          router={this.props.router}
        />
        <div className={style.content}>
          <div className={style.mainContent}>
            {this.props.children}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
